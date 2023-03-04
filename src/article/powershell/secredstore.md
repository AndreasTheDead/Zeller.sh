---
#title: Use Powershell Secret Store with Service Accounts
#shortTitle:  Powershell Secret Store
description: How to Manage Secrets for scheduled Powershell Scripts
icon: terminal
article: true
image: /avatar.png
date: 2023-02-25
category:
  - Powershell
tag:
  - Powershell
  - Passwords
  - Secret Management
  - Secrets
Layout: Layout
toc: true
---
# Use Powershell Secret Store with Service Accounts

Sometimes it's needed to use secrets or passwords in scheduled Powershell Scripts. Those secrets should not be written down in the script directly. To do that more securely the Powershell Secret Store should be used.

With the Secret Store Module, the secrets can be securely saved on the Device. A secret saved by the Secret Store Module is encrypted and only the account which created the secret can read it.

Because of this, the best way to use a secret in a scheduled Script would be a [group Managed Service Account](https://learn.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) with the secret saved by the Secret Store Module. How the module can be used, I will now explain.

## Install needed PS modules

First of all, we need to install the needed Powershell modules.

```powershell
Install-Module Microsoft.PowerShell.SecretManagement -Scope AllUsers 
Install-Module Microsoft.PowerShell.SecretStore -Scope AllUsers
```

## Start Powershell as ServiceAccount

After installing the Modules we need to create a Secret Store for the service account.
For that, we need to start a PowerShell session as the service account. The fastest way to do this is by using PsExec.

Just download [PsExec](https://learn.microsoft.com/en-us/sysinternals/downloads/psexec) and extract the downloaded file to a folder, then open a Powershell Console and navigate to that location.
Now use the following commands to start a Powershell session as the target service account.

::: code-tabs#shell

@tab Group Managed Service Account

```powershell
.\PsExec64.exe -u <Domain>\<gMSA>$ powershell.exe
```

@tab Classic Service Account

```powershell
.\PsExec64.exe -u <Domain>\<ServiceAccount> powershell.exe
```

:::

## First use

We can now create the Secret Vault.
The commands first create a Secret Store and then set the authentication from ***password*** to ***none***, else it could not be used in a scheduled Script.

When running the second command you will be asked to set a password for the vault, to confirm that password and then to confirm the disabling of the authentication, with the just created password.

```powershell
Register-SecretVault -Name <SecretStore> -ModuleName Microsoft.PowerShell.SecretStore -DefaultVault
Set-SecretStoreConfiguration -Authentication None
```

## Add credentials

Now a secret can be added to the newly created Secret Store.

This command will pop up a window where a username and secret/password can be entered, which then get added to the Store.

```powershell
Set-Secret -Vault <SecretStore> -Name <CredentialName> -Secret (Get-Credential) -Metadata @{Description = "Some Credential description"}
```

## Retrieving a Secret

The retrieval of a secret is simple, just enter the following command and you will get a PSCredential object with the username and secret.

```powershell
$credential = Get-Secret -Vault <SecretStore> -Name <CredentialName>
```

Some examples how this can be used:

::: code-tabs#powershell
@tab Connect-AZAccount

```powershell
$cred = Get-Secret -Vault <SecretStore> -Name <CredentialName>
Connect-AzAccount -Credential $cred -Tenant "<TenantID>" -Subscription "<SubscriptionID>" -ServicePrincipal
```

@tab Connect-MgGraph

```powershell
#Requires at least MgGraph version 2.0, which at time of Writing is in preview
$cred = Get-Secret -Vault <SecretStore> -Name <CredentialName>
Connect-MgGraph -ClientSecretCredential $cred -TenantId "<TenantID>"
```

@tab Get secret in clear text

```powershell
$cred = Get-Secret -Vault <SecretStore> -Name <CredentialName>
$ClearTextPW = ($cred.GetNetworkCredential()).Password
```

:::

## Helpful other Commands

### Secret Vault configuration

``` Get-SecretVault ``` Shows all available Secret Stores.\
``` Get-SecretInfo -Name * ``` Shows all available secrets.\
``` Get-SecretInfo -Name <SecretName> ``` Shows information about a secret.\
``` Remove-Secret -Vault <SecretStore> -Name <SecretName> ``` Removes a secret.\
``` Set-SecretInfo -Vault <SecretStore> -Name <SecretName> -Metadata @{ Description = "Some Credential description" } ``` Sets the metadata of a secret.\
``` Set-SecretVaultDefault -Vault <SecretStore> ``` Sets the selected vault as the default vault for the current User.

### Microsoft.PowerShell.SecretStore configuration

``` Reset-SecretStore ``` Resets the Microsoft.PowerShell.SecretStore store of the current user.\
``` Get-SecretStoreConfiguration ``` Shows the Configuration of the Microsoft.PowerShell.SecretStore store.\

## More links

[Microsoft documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.secretmanagement/?view=ps-modules)\
[Microsoft blog post](https://devblogs.microsoft.com/powershell/secretmanagement-and-secretstore-are-generally-available/)
