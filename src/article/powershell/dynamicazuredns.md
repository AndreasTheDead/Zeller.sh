---
icon: code
date: 2023-03-19
author: Andreas Zeller
category:
  - Powershell
  - Azure
tag:
  - DDNS
  - AzureCLI
  - Powershell
  - Homelab
---

# Use Dynamic DNS with Azure DNS zones

I wanted to use Azure DNS Zones for my personal domains. The problem I noticed, was that I cannot use a CName record at the root of a Domain, but because my Website and some more stuff is hosted at my home where I have a dynamic IP adress I needed to find a solution to update an Azure DNS A-Record when my IP Adress changes.

The solution I decided on was to use a scheduled Powershell Script.

## Requirements

### Install needed PS modules

To use the Scripts on this site, the Azure Powershell Module needs to be installed.

```powershell
Install-Module AZ -Scope AllUsers 
```

Then restart your Powershell Session

### Create Azure Service Principle with Access to the DNS Zones

To enable the Script to edit the DNS records I needed to create a Service Principle which has the needed roles for the DNS Zones.
To make the creation as easy as possible and give myself the possibility to add access rights to newly created DNS Zones I created a Script for it.

What the Script does is quite Simple.

- First, it checks if a Service Principle with the Entered Name already exists
  - If yes it doesn't do anything in this step
  - If not, it creates the Service Principle and outputs all needed information (Please save the Secret somewhere, it cannot be shown again)
- Then it loops through the DNS Zones and checks if a role assignment already exists
  - If not, it adds the Service Principle with the Role **DNS Zone Contributor** to the DNS Zone

```powershell
function Set-DNSServicePrincipleAndDNSZoneAccess {
    param (
        [Parameter(Mandatory=$true)][String]$DisplayName
    )
    #Check if Service Principle exists
    $sp = Get-AzADServicePrincipal -DisplayName $DisplayName
    #If not create the Service Principle
    if([string]::IsNullOrEmpty($sp)){
        $newsp = New-AzADServicePrincipal -DisplayName $DisplayName `
            -Role "DNS Zone Contributor" `
            -Scope $dnszones[0].ResourceId
        Write-Host "Creating Service Principal" -ForegroundColor Green
        Write-Host "DisplayName: $($newsp.DisplayName)"
        Write-Host "TenantID: $((Get-AzTenant).ID)"
        Write-Host "SubscriptionID: $($dnszones[0].SubscriptionId)"
        Write-Host "AppId: $($newsp.AppId)"
        Write-Host "AppSecret: $($newsp.PasswordCredentials.SecretText)"
        Start-Sleep -Seconds 10
        $sp = Get-AzADServicePrincipal -DisplayName $DisplayName
    }else{
        Write-Host "Error Creation Service Principal"
    }
    
    #Check if assignments exists, if not add role assignment.
    $dnszones = Get-AzDnsZone | ForEach-Object {Get-AzResource -Name $_.Name | Select Name,SubscriptionId,ResourceId}
    $roleassignments = Get-AzRoleAssignment -ObjectId $sp.Id
    foreach($zone in $dnszones){
        if(!($roleassignments.Scope -contains $zone.ResourceId)){
            Write-Host "Add Assignment for $($zone.Name)"
            New-AzRoleAssignment -ObjectId $sp.Id `
                -Scope $zone.ResourceId `
                -RoleDefinitionName "DNS Zone Contributor" | Out-Null
        }else{
            Write-Host "Assignment allready exists for $($zone.Name)"
        }
    }
}

#Logon to Azure with a Account who can Create Service Principles and can do a Role assignment.
Connect-AzAccount
#Run the Function
Set-DNSServicePrincipleAndDNSZoneAccess -DisplayName "DynamicDNSUpdater"
```

### Setup Secret Store and add App credentials

The Basic Setup of a Secret Store I have Explained [here](/article/powershell/secredstore.html).
If you have not yet done that please do this now and then continue here.

Please open a [Powershell session with the intended Service Account](/article/powershell/secredstore.html#start-powershell-as-serviceaccount) for the Scheduled Task.
Then add a Secret with the Service Account credentials.

```powershell
$AppID = "befefa01-XXXX-XXXX-XXXX-272ff33ce314"
$AppSecret = "XXXXXXXXXXXXX"
$secStringSecret = ConvertTo-SecureString $AppSecret -AsPlainText
Set-Secret -Name "AzureADDNSServicePrinciple" `
  -Metadata @{Description = "AppID and Secred for Service Principle DynamicDNSUpdater"} `
  -Secret (New-Object System.Management.Automation.PSCredential ($AppID, $secStringSecret))
```

Now you can close the current Powershell windows again.

## Create Script and schedule Script

The script consists of several parts which I explain bit by bit.
You should paste the Parts in a single PS1 File.

### Part 1

The First part is the parameter block, there you will need to enter some information about your AZ DNS Zone.
And you will need to define which DNSZone and record should get updated.

The $CacheFile is the file where the public IP from the last run, is saved and checked against so that the Script only updates the records when the Public IP did change.

The $DomainsToUpdate is a Hashtable where the Key is the DNSZone and the Value is the Subdomain which should get updated.

```powershell
param (
    $AZTennand = "49dccf52-XXXX-XXXX-XXXX-2919fb90fa5d",
    $AZSubscription = "96f4469a-XXXX-XXXX-XXXX-2d73cf4acc63",
    $AZResourceGroup = "rg-dns",
    $AZAppCred = Get-Secret -Name "AzureADDNSServicePrinciple",
    $CacheFile = "C:\Sysop\UpdateDynamicDNS\CachedPublicIP.txt",
    $DomainsToUpdate = @{"zeller.sh"="dyn";
                        "zeller-nas.de"="dyn"}
)
```

### Part 2

Now the Script gets the Current Public IP and the cached public IP.

```powershell
$currentPublicIP = (Invoke-WebRequest https://ipinfo.io/ip).Content
$CachedPublicIP =  Get-Content $CacheFile
```

### Part 3

When the current Public IP is another from the cached public IP the Scripts connects to Azure and updates the specified Records.

```powershell
if($currentPublicIP -ne $CachedPublicIP){
    #Connect to Azure
    Connect-AzAccount -Credential $AZredential -Tenant $AZTennand -Subscription $AZSubscription -ServicePrincipal
    #Set New ip in azure
    foreach($domain in $DomainsToUpdate.Keys){
        $cuDNSRecordSet = Get-AzDnsRecordSet -ResourceGroupName $AZResourceGroup -ZoneName $domain -Name $DomainsToUpdate[$Domain] -RecordType A
        Remove-AzDnsRecordConfig -RecordSet $cuDNSRecordSet -Ipv4Address $cuDNSRecordSet.Records[0]
        Add-AzDnsRecordConfig -RecordSet $cuDNSRecordSet -Ipv4Address $currentPublicIP
        Set-AzDnsRecordSet -RecordSet $cuDNSRecordSet
        Remove-Variable cuDNSRecordSet -ErrorAction SilentlyContinue
    }
    #Write New IP into Cache File
    $currentPublicIP | Out-File -FilePath $CacheFile -Force -NoNewline
}
```

### The whole script

This is the Whole Script how it should be in your PS1 file.

<details>
<summary>Complete Script</summary>

```powershell
param (
    $AZTennand = "49dccf52-XXXX-XXXX-XXXX-2919fb90fa5d",
    $AZSubscription = "96f4469a-XXXX-XXXX-XXXX-2d73cf4acc63",
    $AZResourceGroup = "rg-dns",
    $AZAppCred = Get-Secret -Name "AzureADDNSServicePrinciple",
    $DomainsToUpdate = @{"zeller.sh"="dyn";
                        "zeller-schenefeld.de"="dyn"},
    $CacheFile = "C:\Sysop\UpdateDynamicDNS\CachedPublicIP.txt"
)
#Requires -Modules Az.Accounts, Az.Dns, Az.Resources

# Get current Public IP and cached IP
$currentPublicIP = (Invoke-WebRequest https://ipinfo.io/ip).Content
$CachedPublicIP =  Get-Content $CacheFile

# Check if PublicIP did Change and if yes update IP in azure
if($currentPublicIP -ne $CachedPublicIP){
    #Connect to Azure
    Connect-AzAccount -Credential $AZredential -Tenant $AZTennand -Subscription $AZSubscription -ServicePrincipal
    #Set New ip in azure
    foreach($domain in $DomainsToUpdate.Keys){
        $cuDNSRecordSet = Get-AzDnsRecordSet -ResourceGroupName $AZResourceGroup -ZoneName $domain -Name $DomainsToUpdate[$Domain] -RecordType A
        Remove-AzDnsRecordConfig -RecordSet $cuDNSRecordSet -Ipv4Address $cuDNSRecordSet.Records[0]
        Add-AzDnsRecordConfig -RecordSet $cuDNSRecordSet -Ipv4Address $currentPublicIP
        Set-AzDnsRecordSet -RecordSet $cuDNSRecordSet
        Remove-Variable cuDNSRecordSet -ErrorAction SilentlyContinue
    }
    #Write New IP into Cache File
    $currentPublicIP | Out-File -FilePath $CacheFile -Force -NoNewline
}
```

</details>

### Schedule Script
