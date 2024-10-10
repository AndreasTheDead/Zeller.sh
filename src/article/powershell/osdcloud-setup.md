---
icon: laptop
date: 2024-10-08
category:
  - Powershell
  - Intune
tag:
  - OSDCloud
  - Powershell
  - Intune
---

# Reset different Notebook Models for Intune

At the place where I work we have the problem that we have multiple different notebook models and manufacturer in use and sometimes need to reset those devices via USB. While I was searching for a way to make the deployment as easy as possible, and create the possibility to have multiple languages on a single USB, I learned about OSDCloud. OSDClouds makes it possible to install different drivers and languages on Notebooks from a single USB stick without the need to create custom Windows Images. The Creation of an USB with OSDCloud is quite straightforward.

A tldr is available on the [bottom of the page](#tldr).
<!-- more -->

## What is OSDCloud

OSDCloud is a Powershell module which uses the Windows ADK to create a WindowsPE environment which is used to format the drive and install the required Windows language and Drivers.

There are two possibilities to use that tool, you can burn an iso and it will download the Windows image/drivers each time you boot from it.

And the second one is to create a USB with the tool and the USB will cache done downloads which makes a second install way faster because nothing needs to get downloaded again.

## Preparations

Start an administrative Powershell and install the needed Module.

```powershell
Install-Module OSD
```

OSDCloud also needs the Windows ADK and the PE Addon which can be downloaded from [Windows ADK](https://learn.microsoft.com/en-us/windows-hardware/get-started/adk-install)

The Current version for Windows 11 24H2 are [Windows ADK](https://go.microsoft.com/fwlink/?linkid=2271337) and [Windows PE add-on](https://go.microsoft.com/fwlink/?linkid=2271338)

You only need to install Deployment Tools of the Windows ADK. From the WinPE Addon you need to install everything.

## Setup the template

After the installation, you will need to create an OSDCloud Template, which contains the Windows PE files.

The first template can be created with `New-OSDCloudTemplate` and some arguments the following arguments can be used if needed.

- `-CumulativeUpdate <PathToFile>`: With that updates can be added to WindowsPE which is needed for Windows 11/10 because of [CVE-2023-24932](https://support.microsoft.com/en-us/topic/kb5025885-how-to-manage-the-windows-boot-manager-revocations-for-secure-boot-changes-associated-with-cve-2023-24932-41a975df-beb2-40c1-99a3-b3ff139f832d). The needed updates can be downloaded from the [Windows update catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=kb5028185)
- `-SetInputLocale <Primary input profile/keyboard>`: With that the default keyboard layout for the WindowsPE can be set. The required code can be found in the [Microsoft documentation](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-input-locales-for-windows-language-packs?view=windows-11#input-locales) where the value in the brackets is needed e.g. "0407:00000407".
- `-Language <Language>`: With that you can add additional languages to the WinPE. The code can be found in the [Microsoft documentation](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-input-locales-for-windows-language-packs?view=windows-11#input-locales). The Short code needs to be used, e.g. "de-DE".
- `-SetAllIntl <Language>`: With that you can set the default language for the WinPE. To set it to German use "de-DE" as shortcut.

Normally for my multinational Employer I'm using the Command without any additional arguments, which results in an english WinPE with US keyboard layout:

```powershell
New-OSDCloudTemplate
```

This command runs for around 10 to 15 minutes. After that under "C:\ProgramData\OSDCloud" the template will be created and the first isos will be available. In this folder you also find two iso files "OSDCloud.iso" and "OSDCloud_NoPrompt.iso" This could already be used to format devices and install Windows, to customize this image a bit more, we need to create a workspace from the template.

## Setup a workspace

When a template was created, we can add startup actions, default options and some more stuff in an OSD workspace.
Create and select a workspace with:

```powershell
New-OSDCloudWorkspace
Set-OSDCloudWorkspace C:\OSDCloud
```

Now we can add multiple things. Each change will take some time.
All Edit-OSDCloudWinPE arguments can be put into a single command, to speed the process up.

When those changes are done, the resulting isos under "C:\OSDCloud" can be handed out and used to reset Devices.

### Cleanup Workspace

To save a bit of space in the ISO you can delete not needed folders from the OSDCloud workspace.
Add the additional Languages you added to list of folders to keep.

```powershell
$KeepTheseDirs = @('boot','efi','en-us','sources','fonts','resources','OSDCloud') 
Get-ChildItem "C:\OSDCloud\Media" | Where {$_.PSIsContainer} | Where {$_.Name -notin $KeepTheseDirs} | Remove-Item -Recurse -Force 
Get-ChildItem "C:\OSDCloud\Media\Boot" | Where {$_.PSIsContainer} | Where {$_.Name -notin $KeepTheseDirs} | Remove-Item -Recurse -Force 
Get-ChildItem "C:\OSDCloud\Media\EFI\Microsoft\Boot" | Where {$_.PSIsContainer} | Where {$_.Name -notin $KeepTheseDirs} | Remove-Item -Recurse -Force 
Get-ChildItem "C:\OSDCloud\Media\EFI\Boot" | Where {$_.PSIsContainer} | Where {$_.Name -notin $KeepTheseDirs} | Remove-Item -Recurse -Force 
```

### Customize WinPE

You can add multiple things to the WinPE. This can be done with the `Edit-OSDCloudWinPE` Command.

#### Drivers

You can add all available WindowsPE drivers run the following command.

```powershell
Edit-OSDCloudWinPE -CloudDriver *
```

#### Wallpaper

By default the Windows PE has a blue background, you can change this with this command.

```powershell
Edit-OSDCloudWinPE -Wallpaper "<Path to jpg>"
```

#### Branding

You can replace the default "OSDCloud" banner with your own company name.

```powershell
Edit-OSDCloudWinPE -Brand "<Company Name>"
```

#### Start-OSDCloudGUI.json

With the Start-OSDCloudGUI.json the OSDCloud gui can be limited to specific Windows versions or some default settings can be set.
All available settings can be found under [OSDCloudGUI Defaults](https://www.osdcloud.com/osdcloud-automate/osdcloudgui-defaults).
The json content needs to be saved in a "C:\OSDCloud\Media\OSDCloud\Automate\Start-OSDCloudGUI.json" file.
Create the file.

```powershell
New-Item C:\OSDCloud\Media\OSDCloud\Automate\Start-OSDCloudGUI.json -Force
```

The config file that In currently use has the following content:

```json
{
    "BrandColor": "#b42000",
    "BrandName": "Zeller.sh",
    "ClearDiskConfirm": false,
    "OSActivation": "Retail",
    "OSActivationValues": [
        "Retail"
    ],
    "OSEdition": "Pro",
    "OSEditionValues": [
        "Pro"
    ],
    "OSImageIndex": 9,
    "OSLanguage": "en-us",
    "OSLanguageValues": [
        "de-de",
        "en-us"
    ],
    "OSName": "Windows 11 24H2 x64",
    "OSNameValues": [
        "Windows 11 24H2 x64"
    ],
    "OSReleaseID": "24H2",
    "OSReleaseIDValues": [
        "24H2"
    ],
    "OSVersion": "Windows 11",
    "OSVersionValues": [
        "Windows 11"
    ]
}
```

This makes sure that the booted ISO can only be used to install Windows 11 24H2 in german and english.

#### Combine all Setting

Those settings can be combined into a single command.
The one Im using to create my OSD ISOs is the following:

```powershell
Edit-OSDCloudWinPE -CloudDriver * -Wallpaper "C:\Temp\OSD-background.jpg" -StartOSDCloudGUI -Brand "Zeller.sh" 
```

The command runs in ~5 minutes.

The resulting booted ISO looks like this:
![Booted OSDCloud menue](/images/osdcloud/booted.png)

The created ISO/workspace can now be used to prepare an USB stick.

## Setup USB Stick with offline Usage

You can create a USB stick from the ISO file, which I'm using for the OnsiteSupport at my employer. So I just need to distribute the iso file and some simple lines of Powershell.
But if you created the OSDCloud workspace on the device where you want to create the USB you can also do that.

Attach an empty USB stick and run the following command:

::: code-tabs#powershell

@tab From the ISO

```powershell
New-OSDCloudUSB -fromIsoFile <Path to OSDCloud ISO file>
```

@tab Workspace on Device

```powershell
New-OSDCloudUSB
```

:::

USBs which are created with New-OSDCloudUSB work offline when the needed OS and drivers are added to the stick.
This happens automatically the first time you use the stick on a Device with an attached Ethernet cable or you can Add them bevor booting from them.

Drivers are available for Dell, HP, Lenovo and Microsoft.
To add Drivers and the OS to the stick in preparation do the following:

```powershell
Update-OSDCloudUSB -DriverPack <manufacturer>
```

To download a OS do the following, you can define the OS version and OSName to make the list a little bit mor organized.

```powershell
Update-OSDCloudUSB -OS -OSNAME 'Windows 11 22H2' -OSLicense Retail
```

Now you can take the USB and boot a Device without internet connection and reinstall the OS on there.

## Create USB for onetime use

If you need to create an USB which will only be used onetime, you can simply burn the OSDCloud iso to an USB with a software like [Rufus](https://rufus.ie/en/).
This stick then only can be used when the device has an ethernet connection as the OS and Drivers get downloaded at every use.

## TLDR

- Install Windows ADK and Windows PE addon
- Run the following commands

```powershell
# Install Windows ADK and Windows PE addon
New-OSDCloudTemplate # Create OSDCloud Template
New-OSDCloudWorkspace # Create OSDCloud Workspace
Set-OSDCloudWorkspace C:\OSDCloud # Select OSDCloud Workspace
$KeepTheseDirs = @('boot','efi','en-us','sources','fonts','resources','OSDCloud') #Cleanup not needed folders
Get-ChildItem "C:\OSDCloud\Media" | Where {$_.PSIsContainer} | Where {$_.Name -notin $KeepTheseDirs} | Remove-Item -Recurse -Force 
Get-ChildItem "C:\OSDCloud\Media\Boot" | Where {$_.PSIsContainer} | Where {$_.Name -notin $KeepTheseDirs} | Remove-Item -Recurse -Force 
Get-ChildItem "C:\OSDCloud\Media\EFI\Microsoft\Boot" | Where {$_.PSIsContainer} | Where {$_.Name -notin $KeepTheseDirs} | Remove-Item -Recurse -Force 
Get-ChildItem "C:\OSDCloud\Media\EFI\Boot" | Where {$_.PSIsContainer} | Where {$_.Name -notin $KeepTheseDirs} | Remove-Item -Recurse -Force
# Add Start-OSDCloudGUI.json to C:\OSDCloud\Media\OSDCloud\Automate\
Edit-OSDCloudWinPE -CloudDriver * -Wallpaper "C:\Temp\OSD-background.jpg" -StartOSDCloudGUI -Brand "Zeller.sh" # Set Defaults
New-OSDCloudUSB # Create USB Stick
Update-OSDCloudUSB -DriverPack <manufacturer> # Add Drivers to USB
Update-OSDCloudUSB -OS -OSNAME 'Windows 11 22H2' -OSLicense Retail # Add OS to USB
```

## Links to OSDCloud Documentation

- [OSD Cloud Templates](https://www.osdcloud.com/osdcloud/setup/osdcloud-template)
- [OSD Cloud Workspaces](https://www.osdcloud.com/osdcloud/setup/osdcloud-workspace)
- [OSD Cloud USB](https://www.osdcloud.com/osdcloud/setup/osdcloud-usb)
