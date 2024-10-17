---
icon: code
date: 2024-10-10
category:
  - Cloud
tag:
  - DNS
  - Github
  - Cloudflare
  - Homelab
  - DNSControl
  - IAC
---

# DNS management with a CI/CD pipeline

As we started working with Terraform on work, I thought about a fun process to learn it a bit, I started to implement my Public DNS records as code. While doing that I learned about an DNS PRovider agnostic way, using the tool DNSControl.

DNSControl is a way to implement, DNS as Code where the configuration of the DNS records is as Provider independent as possible.
The nice thing for that is, that you have your DNS configuration on a Provider independent file and that you can simply add comments to your records to explain why they are there and who requested them.

<!-- more -->

## Prepare a Repository

The folder structure is not complicated. The easiest way to create the repository is to clone the [example repository](https://github.com/AndreasTheDead/DNSControl-Blueprint) which I created.
That repository has all needed files with a quick start guide, I will in the following, explain a bit about every file in that repository.

Or you can just create the files, following the explanation of the file types.

## Config Files

### creds.json

The creds.json is a quite simple json file.
If you push the configuration to a git repository I suggest that you don't push a creds.json with working credentials. To be able to still test localy, I'm using a creds-local.json

In the file the used provider need to be configured.

for Cloudflare it would be the following:

```json title="creds.json"
{
  "cloudflare": {
    "TYPE": "CLOUDFLAREAPI",
    "accountid": "<cloudflare-account-id>",
    "apitoken": "<cloudflare-api-token>"
  }
}
```

Cloudflare API Token can be created in the [Dashboard](https://dash.cloudflare.com/) under "Manage Account" and then "API Tokens".
Your Account id you can copy from the Dashboard URL `dash.cloudflare.com/<AccountID>/api-tokens`.

For other Provider, please check the official [Documentation](https://docs.dnscontrol.org/provider).

### dnsconfig.js

The dnsconfig.js is the default file were the Domains get defined.
It starts with the definition of the Registrar and DNS Provider.

DNSControl can manage the delegation of a Domain with the registrar, as you don't normally want to do that, we will create a "none" type registrar.
As provider we will create a Cloudflare provider.
Both the created registrar and dns Provider need to be saved in a variable.

```ts title="dnsconfig.js"
var REG_NONE = NewRegistrar("none");
var DNS_CLOUDFLARE = NewDnsProvider("cloudflare");
```

The next step is to add your first domain.
The Domain definition needs to contain the domain, the registrar variable, the DNS provider.
that looks like this:

```ts title="dnsconfig.js"
D("example.com", REG_NONE, DnsProvider(DNS_CLOUDFLARE),
);
```

For cloudflare I normally also add the following two things

```ts title="dnsconfig.js"
DefaultTTL("5m"),
CF_PROXY_DEFAULT_OFF
```

This sets the default Time to Live of a record to 5 minutes and sets the the Proxy functionality to disabled as default for records.

#### DNS records

Now I will explain how to add the most used Record types.
All records can also be set into an variable like this: `var DNSRecord = [A("subdomain","1.2.3.4")]`.

The structure of a record function is `<recordType>("<subdomain>","<Target>")`
To add a record to the root of a Domain use @ as domain.

::: tabs

@tab A

```ts title="dnsconfig.js"
A("<subdomain>", "<Target IPv4>"),
```

@tab AAAA

```ts title="dnsconfig.js"
AAAA("<subdomain>", "<Target IPv6>"),
```

@tab MX

```ts title="dnsconfig.js"
MX("<Subdomain>", "<priority>","<target mail server>"),
```

@tab TXT

```ts title="dnsconfig.js"
TXT("<subdomain>", "<txt content>"),
```

@tab CName

```ts title="dnsconfig.js"
CName("<subdomain>", "<target domain>"),
```

for CName records the target domain needs to end with a `.`

@tab Alias

Some domain provider like Cloudflare support a Alias record type as replacement of CNames, for situations where a CName records cannot be used, like to domain apex.

```ts title="dnsconfig.js"
Alias("@", "<target domain>"),
```

for Alias records the target domain needs to end with a `.`

@tab Ignore

The Ignore type allows you to add records which are ignored by DNSControl. This can be used to protect entries from being deleted if they were not created by DNSControl, which would be the default behavior.

```ts title="dnsconfig.js"
IGNORE("<record/subdomain>", "<record Type (optional)>"),
```

Normally im using this type for Let's Encrypt validation records. So that DNSControl will never delete them.

```ts title="dnsconfig.js"
IGNORE("_acme-challenge", "TXT"),
IGNORE("_acme-challenge.**", "TXT"),
```

For more information about Ignore Types you can check [this link](https://docs.dnscontrol.org/language-reference/domain-modifiers/ignore).

:::

#### DNS record builders

::: tabs

@tab SPF

To make the usage of SPF easier, DNSControl provides a SPF builder.

The builder automatically converts the entered values automatically into a SPF record, of the Record would be to big, it automatically moves it into multiply dns records.

```ts title="dnsconfig.js"
SPF_BUILDER({
    label: "@",
    overflow: "_spf%d",
    parts: [
        "v=spf1",
        "include:<domain>",
        "a:<a record to include>",
        "mx",
    ]
})
```

For more information about spf records you can check [this link](https://www.spf-record.com/syntax).

@tab DMARC

To make the usage of DMARC easier, DNSControl provides a DMARC builder.

The builder automatically converts the entered values automatically into a txt record with the correct '_dmarc' subdomain.

```ts title="dnsconfig.js"
DMARC_BUILDER({
    policy: "<policy setting>",
    rua: [
        "mailto:<webmaster mail address>"
    ],
    ruf: [
        "mailto:<webmaster mail address>"
    ],
})
```

For more information about DMARC records you can check [this link](https://dmarc.org/overview/).

@tab CAA

To make the usage of CAA Records easier, DNSControl provides a CAA builder.

The builder automatically converts the entered values into CAA records.

```ts title="dnsconfig.js"
CAA_BUILDER({
    label: "@",
    iodef: "mailto:<target mail adress>",
    issue: [
    "<issuer domain>",
    ],
    issuewild: [
        "<issuer domain>",
    ],
    })
```

For more information about CAA records you can check [this link](https://letsencrypt.org/docs/caa/).

@tab M365

DNSControl even has a way to automatically generate the needed DNS records for Microsoft 365.
In the Builder you can select which parts you need dns records created for.

You will still need to create your SPF and DMARC values.

```ts title="dnsconfig.js"
M365_BUILDER("<domain>", {
      mx: false,
      autodiscover: false,
      dkim: false,
      mdm: true,
      initialDomain: "<onmicrosoft.com domain>",
  })
```

For more information about the M365 builder you can check [this link](https://docs.dnscontrol.org/language-reference/domain-modifiers/m365_builder).

:::

#### Complete file

A full dnsconfig.js file, which uses all here explained record types, would look like this.

<details>
  <summary>dnsconfig.js</summary>

```ts title="dnsconfig.js"
var REG_NONE = NewRegistrar("none");
var DNS_CLOUDFLARE = NewDnsProvider("cloudflare");

var DefaultCAA = [
    CAA_BUILDER({
        label: "@",
        iodef: "mailto:cert@example.com",
        issue: [
        "letsencrypt.org", //letsencrypt
        "sectigo.org", //zeroSSL
        ],
        issuewild: [
            "letsencrypt.org", //letsencrypt
            "sectigo.org", //zeroSSL
        ],
        })
    ]

var DefaultDMARC = [
    DMARC_BUILDER({
        policy: "quarantine",
        rua: [
            "mailto:webmaster@example.com"
        ],
        ruf: [
            "mailto:webmaster@example.com"
        ],
    })
]

var DefaultSPF = [
    SPF_BUILDER({
        label: "@",
        overflow: "_spf%d",
        parts: [
            "v=spf1",
            "include:sendgrid.net",
            "a:mail.example.com",
            "mx",
        ]
    })
]

//Domains
D("example.com", REG_NONE, DnsProvider(DNS_CLOUDFLARE),DefaultTTL("5m"),
    CF_PROXY_DEFAULT_OFF, //disables proxy default for that domain
    DefaultCAA,
    DefaultDMARC,
    DefaultSPF,
    ALIAS("@","dyn.example.com."),
    CNAME("www","example.com."),
    A("ipv4","8.8.8.8"),
    A("ipv6","::1"),
    MX("@", 10, "mail.example.com."),
    IGNORE("_acme-challenge", "TXT"),
    IGNORE("_acme-challenge.**", "TXT")
);
```

</details>

### .gitignore

The .gitignore file im using only has two entry's.

```.gitignore title=".gitignore"
creds-local.json
dnscontrol*.exe
```

The creds-local.json im using to test locally my configuration and should newer by synced to Github.
The dnscontrol*.exe is added so that i can put the executable into the repository without uploading it to Github.

### types-dnscontrol.d.ts

The types-dnscontrol.d.ts is used for Visual Studio Code to have the possibility to use autocompletion when creating a dns control file.

To create or update the file run `.\dnscontrol.exe write-types`.

Now add the following to your .js files.

```js title="dnsconfig.js"
// @ts-check
/// <reference path="types-dnscontrol.d.ts" />
```

## Testing the configuration

DNSControl has a preview function to check what changes would be done, when applying the config.

::: tabs

@tab using creds.json

```powershell
.\dnscontrol.exe preview

******************** Domain: zeller.sh
Done. 0 corrections.
```

@tab using creds-local.json

```powershell
.\dnscontrol.exe preview --creds .\creds-local.json

******************** Domain: zeller.sh
Done. 0 corrections.
```

:::

## Applying the configuration

To apply the configuration on your provided DNS provider run the following:

::: tabs

@tab using creds.json

```powershell
.\dnscontrol.exe push

******************** Domain: zeller.sh
1 correction (cloudflare)
#1: + CREATE test.zeller.sh A 1.2.3.4 proxy=false ttl=1
Done. 1 corrections.
```

@tab using creds-local.json

```powershell
.\dnscontrol.exe push --creds .\creds-local.json

******************** Domain: zeller.sh
1 correction (cloudflare)
#1: + CREATE test.zeller.sh A 1.2.3.4 proxy=false ttl=1
Done. 1 corrections.
```

:::

## GitHub Workflow

To have it run as CI we need to configure a Github action.

To use the github credential manager for Actions change the creds.json to use variables.

```json title="creds.js"
{
"cloudflare": {
    "TYPE": "CLOUDFLAREAPI",
    "accountid": "$CLOUDFLARE_API_ACCOUNTID",
    "apitoken": "$CLOUDFLARE_API_TOKEN"
},
"none": { "TYPE": "NONE" }
}
```

Then you need to add a secret and a variable to your project settings.
For that go to the repository settings -> Secrets and variables -> Actions.
And add a secret with your API Token and a variable with your AccountID.

![Github Settings](/images/dnspipleine/githubvariables.png)

Now we need to create the workflow file. Create a the ".github/workflows/main.yml" file and add the following content:

```yml title=".github/workflows/main.yml"
name: Test and Apply DNS Configuration

on:
  push:
    branches:
      - main
    paths:
      - 'dnsconfig.js'
      - 'Domains/**'
  workflow_dispatch:

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: DNSControl preview
        uses: wblondel/dnscontrol-action@v4
        id: dnscontrol_preview
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_API_ACCOUNTID: ${{ vars.CLOUDFLARE_API_ACCOUNTID }}
        with:
          args: preview
  push:
    runs-on: ubuntu-latest
    needs: preview
    steps:
      - uses: actions/checkout@v4
      - name: DNSControl push
        uses: wblondel/dnscontrol-action@v4
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_API_ACCOUNTID: ${{ vars.CLOUDFLARE_API_ACCOUNTID }}
        with:
          args: push
```

This action will trigger on changes with the dnsconfig.js or changes in a "Domains" folder.
First the action will do a preview to check the validity of the files and afterwords it will push the changes to your provider.

## split Domains into multiple Files

To make the overview of the files a bit easier you can move the domain configurations into multiple files.
Normally I'm using a Domains folder for that.

To use that you can add the following to your domain section in the dnsconfig.js file.
The secund argument makes the import recursive, so it includes subfolder.

```js title="dnsconfig.js"
require_glob("./Domains/",true);
```

This imports then all js files in the Domains folder.
The file in the Domains folder looks like this:

```js title="example.com.js"
// @ts-check
/// <reference path="../types-dnscontrol.d.ts" />

D("example.com", REG_NONE, DnsProvider(DNS_CLOUDFLARE),DefaultTTL("5m"),
    CF_PROXY_DEFAULT_OFF, //disables proxy default for that domain
    DefaultCAA,
    DefaultDMARC,
    DefaultSPF,
    ALIAS("@","dyn.example.com."),
    CNAME("www","example.com."),
    A("ipv4","8.8.8.8"),
    A("ipv6","::1"),
    MX("@", 10, "mail.example.com."),
    //Ignore Let's Encrypt records
    IGNORE("_acme-challenge", "TXT"),
    IGNORE("_acme-challenge.**", "TXT")
);
```

If your using the Example repository you can just commend in the required line.

Now you have a fully functioning Infrastructure as code and CI/CD pipeline to manage your dns.

## Additional Links

- [DNS Control Docs](https://docs.dnscontrol.org/)
- [Example Repository](https://github.com/AndreasTheDead/DNSControl-Blueprint)
