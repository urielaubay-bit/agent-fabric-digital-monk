# Digital Monk - Agent Fabric Project

This repository contains the Digital Monk project, built by Agent Fabric's autonomous AI development team.

## 🚀 Automatic Deployment

This repository is configured with GitHub Actions to automatically deploy the landing page to https://www.digitalmonk.mx

### How it works

1. Make changes to files in the `landing-page/` directory
2. Commit and push to the `main` branch
3. GitHub Actions automatically deploys to AWS S3 + CloudFront
4. Landing page is live at https://www.digitalmonk.mx within 2-3 minutes

### Manual Deployment

You can also trigger a deployment manually:

1. Go to the [Actions tab](../../actions)
2. Select "Deploy Landing Page to S3"
3. Click "Run workflow"
4. Enter project ID (or leave blank to use context.json)
5. Click "Run workflow"

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy-landing-page.yml    # GitHub Actions deployment workflow
├── landing-page/
│   └── index.html                     # Landing page HTML
├── context.json                       # Project metadata
└── README.md                          # This file
```

## 🔧 Configuration

### Project Metadata

The `context.json` file contains project metadata:

```json
{
  "project_id": "118c0096-e8de-4697-9900-fd9bb1636a74",
  "project_name": "Digital Monk",
  "github_repo_url": "https://github.com/urielaubay-bit/agent-fabric-digital-monk"
}
```

### GitHub Secrets

The following secrets are configured for deployment:

- `AWS_ACCESS_KEY_ID` - AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for deployment

These are managed by the repository administrator.

## 🌐 Live URLs

- **Landing Page**: https://www.digitalmonk.mx
- **CloudFront Distribution**: https://d1bmitxy75zixy.cloudfront.net
- **S3 Bucket**: agent-fabric-data-vault-439712476071

## 📊 Deployment Status

Check the deployment status in the [Actions tab](../../actions).

Each deployment shows:
- Files uploaded to S3
- CloudFront cache invalidation
- Deployment summary with URLs

## 🛠️ Development

### Local Development

To work on the landing page locally:

1. Clone this repository
2. Edit files in `landing-page/`
3. Open `landing-page/index.html` in your browser
4. Commit and push when ready

### Adding New Files

The deployment workflow automatically syncs all files from the `landing-page/` directory to S3.

Supported file types:
- HTML (`.html`)
- CSS (`.css`)
- JavaScript (`.js`)
- JSON (`.json`)
- Images (`.png`, `.jpg`, `.gif`, `.svg`)
- Fonts (`.woff`, `.woff2`, `.ttf`)

## 📝 Project Information

- **Project ID**: 118c0096-e8de-4697-9900-fd9bb1636a74
- **Status**: Released
- **Completion**: 100%
- **Built by**: Agent Fabric Autonomous Team

## 🤖 About Agent Fabric

Agent Fabric is an autonomous AI development platform that uses specialized AI agents to build software projects from start to finish.

**Team Members**:
- **Lupita** - Product Owner (requirements, planning, release management)
- **Jose** - Developer (implementation, coding, git operations)
- **Miguel** - Tester (quality assurance, testing, validation)

## 📞 Support

For questions or issues with this project, contact the Agent Fabric team.

---

**Last Updated**: 2026-02-23  
**Deployed to**: https://www.digitalmonk.mx
