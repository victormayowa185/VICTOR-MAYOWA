This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: repomix.md, node_modules, dist, .git
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
api/
  contact.js
bin/
  bash.exe
  git.exe
  sh.exe
cmd/
  aslr-manager.ps1
  git-gui.exe
  git-lfs.exe
  git-receive-pack.exe
  git-upload-pack.exe
  git.exe
  gitk.exe
  scalar.exe
  start-ssh-agent.cmd
  start-ssh-pageant.cmd
  tig.exe
public/
  1.png
  2.png
  about.txt
  ademola.png
  android-chrome-192x192.png
  android-chrome-512x512.png
  apple-touch-icon.png
  badge1.png
  badge2.png
  badge3.png
  favicon-16x16.png
  favicon-32x32.png
  favicon.ico
  k.png
  key.png
  logo.png
  logo2.png
  logo3.png
  pic2.png
  picc.png
  see.png
  site.webmanifest
  VIC.png
  video.mp4
sanity/
  schemaTypes/
    category.ts
    index.ts
    post.ts
    project.ts
  static/
    .gitkeep
  .gitignore
  eslint.config.mjs
  package.json
  README.md
  sanity.cli.ts
  sanity.config.ts
  tsconfig.json
src/
  components/
    BlogFeed.tsx
    dateFormatter.ts
    Footer.tsx
    Navbar.tsx
    PostCard.tsx
    TourContext.tsx
    TourOverlay.tsx
    tourQueries.ts
    TypewriterText.tsx
  pages/
    About.tsx
    Blog.tsx
    Contact.tsx
    Home.tsx
    PostDetail.tsx
    Project.tsx
    ProjectCard.tsx
  sanity/
    client.ts
  styles/
    about.css
    blog.css
    blogFeed.css
    contact.css
    footer.css
    home.css
    navbar.css
    postCard.css
    postDetail.css
    project.css
    projectCard.css
    tourOverlay.css
  utils/
    tourStorage.ts
    useCachedPosts.ts
  App.css
  App.tsx
  index.css
  main.tsx
.gitignore
activity.json
eslint.config.js
index.html
mayo-settings.json
package.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vercel.json
vite.config.ts
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="cmd/aslr-manager.ps1">
param(
    [Parameter(Mandatory = $true, HelpMessage="Enable or disable mandatory ASLR for the target executables.")][ValidateSet('Enable', 'Disable')][string]$Action,
    [Parameter(mandatory=$true, ValueFromRemainingArguments=$true, HelpMessage="The paths of the target executables.")][string[]]$paths
)

# Define a string array that will hold the target executable paths.
$targets = @()

# Parse the target executable paths.
$paths | ForEach-Object {
    if (Test-Path -Path "$_" -PathType Container) {
        Get-ChildItem -Path "$_" -Filter *.exe -File | ForEach-Object { $targets += $_.FullName }
    }
    elseif (Test-Path -Path "$_" -PathType File -Filter *.exe) {
        $targets += (Get-ChildItem -Path "$_" -File).FullName
    }
    else {
        throw New-Object ArgumentException("The path `"$_`" provided is not valid!")
    }
}

# Configure the security settings for each executable in the targets array.
$targets | ForEach-Object { Invoke-Expression "Set-ProcessMitigation -Name `"$_`" -$Action ForceRelocateImages" }
</file>

<file path="cmd/start-ssh-agent.cmd">
@REM Do not use "echo off" to not affect any child calls.

@REM Enable extensions, the `verify` call is a trick from the setlocal help
@VERIFY other 2>nul
@SETLOCAL EnableDelayedExpansion
@IF ERRORLEVEL 1 (
    @ECHO Unable to enable extensions
    @GOTO failure
)

@REM Start the ssh-agent if needed by git
@FOR %%i IN ("git.exe") DO @SET GIT=%%~$PATH:i
@IF EXIST "%GIT%" @(
    @REM Get the ssh-agent executable
    @FOR %%i IN ("ssh-agent.exe") DO @SET SSH_AGENT=%%~$PATH:i
    @IF NOT EXIST "%SSH_AGENT%" @(
        @FOR %%s IN ("%GIT%") DO @SET GIT_DIR=%%~dps
        @FOR %%s IN ("!GIT_DIR!") DO @SET GIT_DIR=!GIT_DIR:~0,-1!
        @FOR %%s IN ("!GIT_DIR!") DO @SET GIT_ROOT=%%~dps
        @FOR %%s IN ("!GIT_ROOT!") DO @SET GIT_ROOT=!GIT_ROOT:~0,-1!
        @FOR /D %%s in ("!GIT_ROOT!\usr\bin\ssh-agent.exe") DO @SET SSH_AGENT=%%~s
        @IF NOT EXIST "!SSH_AGENT!" @GOTO ssh-agent-done
    )
    @REM Get the ssh-add executable
    @FOR %%s IN ("!SSH_AGENT!") DO @SET BIN_DIR=%%~dps
    @FOR %%s in ("!BIN_DIR!") DO @SET BIN_DIR=!BIN_DIR:~0,-1!
    @FOR /D %%s in ("!BIN_DIR!\ssh-add.exe") DO @SET SSH_ADD=%%~s
    @IF NOT EXIST "!SSH_ADD!" @GOTO ssh-agent-done
    @REM Check if the agent is running
    @FOR /f "tokens=1-2" %%a IN ('tasklist /fi "imagename eq ssh-agent.exe"') DO @(
        @ECHO %%b | @FINDSTR /r /c:"[0-9][0-9]*" > NUL
        @IF "!ERRORLEVEL!" == "0" @(
            @SET SSH_AGENT_PID=%%b
        ) else @(
            @REM Unset in the case a user kills the agent while a session is open
            @REM needed to remove the old files and prevent a false message
            @SET SSH_AGENT_PID=
        )
    )
    @REM Connect up the current ssh-agent
    @IF [!SSH_AGENT_PID!] == []  @(
        @ECHO Removing old ssh-agent sockets
        @FOR %%s IN (%USERPROFILE%\.ssh\agent\s.*) DO @DEL /q "%%s" 2>nul
    ) ELSE  @(
        @ECHO Found ssh-agent at !SSH_AGENT_PID!
        @FOR %%s IN (%USERPROFILE%\.ssh\agent\s.*) DO @(
            @SET SSH_AUTH_SOCK=%%s
            @SET SSH_AUTH_SOCK=!SSH_AUTH_SOCK:%USERPROFILE%=~!
            @SET SSH_AUTH_SOCK=!SSH_AUTH_SOCK:\=/!
        )
        @IF NOT [!SSH_AUTH_SOCK!] == [] @(
            @ECHO Found ssh-agent socket at !SSH_AUTH_SOCK!
        ) ELSE (
            @ECHO Failed to find ssh-agent socket
            @SET SSH_AGENT_PID=
        )
    )
    @REM See if we have the key
    @"!SSH_ADD!" -l 1>NUL 2>NUL
    @SET result=!ERRORLEVEL!
    @IF NOT !result! == 0 @(
        @IF !result! == 2 @(
            @ECHO | @SET /p=Starting ssh-agent:
            @FOR /f "tokens=1-2 delims==;" %%a IN ('"!SSH_AGENT!"') DO @(
                @IF NOT [%%b] == [] @SET %%a=%%b
            )
            @ECHO. done
        )
        @"!SSH_ADD!"
        @ECHO.
    )
)

:ssh-agent-done
:failure

@ENDLOCAL & @SET "SSH_AUTH_SOCK=%SSH_AUTH_SOCK%" ^
          & @SET "SSH_AGENT_PID=%SSH_AGENT_PID%"

@ECHO %cmdcmdline% | @FINDSTR /l "\"\"" >NUL
@IF NOT ERRORLEVEL 1 @(
    @CALL cmd %*
)
</file>

<file path="cmd/start-ssh-pageant.cmd">
@REM Do not use "echo off" to not affect any child calls.

@REM The goal of this script is to simplify launching `ssh-pageant` at
@REM logon, typically by dropping a shortcut into the Startup folder, so
@REM that Pageant (the PuTTY authentication agent) will always be
@REM accessible. No attempt is made to load SSH keys, since this is
@REM normally handled directly by Pageant, and no interactive shell
@REM will be launched.
@REM 
@REM The `ssh-pageant` utility is launched with the `-r` (reuse socket)
@REM option, to ensure that only a single running incarnation (per user)
@REM will be required... instead of launching a separate process for
@REM every interactive Git Bash session. A side effect of this selection
@REM is that the SSH_AUTH_SOCK environment variable *must* be set prior
@REM to running this script, with the value specifying a unix-style socket
@REM path, and needs to be consistent for all git-related processes. The
@REM easiest way to do this is to set a persistent USER environment
@REM variable, which (under Windows 7) can be done via Control Panel
@REM under System / Advanced System Settings. A typical value would look
@REM similar to:
@REM
@REM    SSH_AUTH_SOCK=/tmp/.ssh-pageant-USERNAME
@REM

@REM Enable extensions, the `verify` call is a trick from the setlocal help
@VERIFY other 2>nul
@SETLOCAL EnableDelayedExpansion
@IF ERRORLEVEL 1 (
    @ECHO Unable to enable extensions
    @GOTO failure
)

@REM Ensure that SSH_AUTH_SOCK is set
@if "x" == "x%SSH_AUTH_SOCK%" @(
    @ECHO The SSH_AUTH_SOCK environment variable must be set prior to running this script. >&2
    @ECHO This is typically configured as a persistent USER variable, using a MSYS2 path for >&2
    @ECHO the ssh-pageant authentication socket as the value. Something similar to: >&2
    @ECHO. >&2
    @ECHO    SSH_AUTH_SOCK=/tmp/.ssh-pageant-%USERNAME% >&2
    @GOTO failure
)

@REM Start ssh-pageant if needed by git
@FOR %%i IN ("git.exe") DO @SET GIT=%%~$PATH:i
@IF EXIST "%GIT%" @(
    @REM Get the ssh-pageant executable
    @FOR %%i IN ("ssh-pageant.exe") DO @SET SSH_PAGEANT=%%~$PATH:i
    @IF NOT EXIST "%SSH_PAGEANT%" @(
        @FOR %%s IN ("%GIT%") DO @SET GIT_DIR=%%~dps
        @FOR %%s IN ("!GIT_DIR!") DO @SET GIT_DIR=!GIT_DIR:~0,-1!
        @FOR %%s IN ("!GIT_DIR!") DO @SET GIT_ROOT=%%~dps
        @FOR %%s IN ("!GIT_ROOT!") DO @SET GIT_ROOT=!GIT_ROOT:~0,-1!
        @FOR /D %%s in ("!GIT_ROOT!\usr\bin\ssh-pageant.exe") DO @SET SSH_PAGEANT=%%~s
        @IF NOT EXIST "!SSH_PAGEANT!" @GOTO ssh-pageant-done
    )
)

@REM Time to make the donuts!
@ECHO Starting ssh-pageant...
@FOR /f "usebackq tokens=1 delims=;" %%o in (`"%SSH_PAGEANT%" -qra %SSH_AUTH_SOCK%`) DO @ECHO %%o

:ssh-pageant-done
:failure
</file>

<file path="activity.json">
[
  {
    "type": "received",
    "fileName": "In from the Cold-S1E5-1080P.mp4",
    "timestamp": "2026-06-16T10:56:06.178Z"
  },
  {
    "type": "sent",
    "fileName": "bin/sh.exe",
    "timestamp": "2026-06-16T10:54:24.841Z"
  },
  {
    "type": "sent",
    "fileName": "bin/git.exe",
    "timestamp": "2026-06-16T10:54:24.822Z"
  },
  {
    "type": "sent",
    "fileName": "bin/bash.exe",
    "timestamp": "2026-06-16T10:54:24.788Z"
  },
  {
    "type": "received",
    "fileName": "bin/sh.exe",
    "timestamp": "2026-06-16T10:46:27.947Z"
  },
  {
    "type": "received",
    "fileName": "bin/git.exe",
    "timestamp": "2026-06-16T10:46:27.923Z"
  },
  {
    "type": "received",
    "fileName": "bin/bash.exe",
    "timestamp": "2026-06-16T10:46:27.885Z"
  },
  {
    "type": "received",
    "fileName": "cmd/tig.exe",
    "timestamp": "2026-06-16T10:46:27.868Z"
  },
  {
    "type": "received",
    "fileName": "",
    "timestamp": "2026-06-16T10:46:27.841Z"
  },
  {
    "type": "received",
    "fileName": "cmd/start-ssh-agent.cmd",
    "timestamp": "2026-06-16T10:46:27.819Z"
  },
  {
    "type": "received",
    "fileName": "cmd/scalar.exe",
    "timestamp": "2026-06-16T10:46:27.766Z"
  },
  {
    "type": "received",
    "fileName": "cmd/gitk.exe",
    "timestamp": "2026-06-16T10:46:27.651Z"
  },
  {
    "type": "received",
    "fileName": "cmd/git.exe",
    "timestamp": "2026-06-16T10:46:27.544Z"
  },
  {
    "type": "received",
    "fileName": "cmd/git-upload-pack.exe",
    "timestamp": "2026-06-16T10:46:27.425Z"
  },
  {
    "type": "received",
    "fileName": "cmd/git-receive-pack.exe",
    "timestamp": "2026-06-16T10:46:27.326Z"
  },
  {
    "type": "received",
    "fileName": "cmd/git-lfs.exe",
    "timestamp": "2026-06-16T10:46:26.804Z"
  },
  {
    "type": "received",
    "fileName": "cmd/git-gui.exe",
    "timestamp": "2026-06-16T10:46:26.780Z"
  },
  {
    "type": "received",
    "fileName": "cmd/aslr-manager.ps1",
    "timestamp": "2026-06-16T10:46:26.643Z"
  }
]
</file>

<file path="mayo-settings.json">
{"savePath":"C:\\Users\\uidhirse\\Desktop\\VICTOR\\portfolio-v2"}
</file>

<file path="api/contact.js">
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, projectType, message } = req.body;

  // 2. Setup Transporter
  const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    auth: {
      user: 'api',
      pass: process.env.MAILTRAP_API_TOKEN,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      subject: `New Message from ${name}`,
      text: `Project: ${projectType}\nMessage: ${message}\nReply to: ${email}`,
      html: `<h3>New Contact</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
</file>

<file path="public/about.txt">
This favicon was generated using the following font:

- Font Title: Poppins
- Font Author: undefined
- Font Source: https://fonts.gstatic.com/s/poppins/v23/pxiEyp8kv8JHgFVrFJDUc1NECPY.ttf
- Font License: undefined)
</file>

<file path="public/site.webmanifest">
{"name":"","short_name":"","icons":[{"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}],"theme_color":"#ffffff","background_color":"#ffffff","display":"standalone"}
</file>

<file path="sanity/schemaTypes/category.ts">
import { defineType, defineField } from 'sanity'

export const categorySchema = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
  ],
})
</file>

<file path="sanity/schemaTypes/project.ts">
import { defineType, defineField } from 'sanity'

export const projectSchema = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Website', value: 'website' },
                    { title: 'App', value: 'app' },
                    { title: 'UI', value: 'ui' },
                    { title: 'Other', value: 'other' },
                ],
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'image',
            title: 'Main Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'projectUrl',
            title: 'Project URL',
            type: 'url',
            description: 'Link to the live project (e.g., https://example.com)',
            validation: Rule => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] })
        })
    ],
})

export const schemaTypes = [projectSchema]
</file>

<file path="sanity/static/.gitkeep">
Files placed here will be served by the Sanity server under the `/static`-prefix
</file>

<file path="sanity/eslint.config.mjs">
import studio from '@sanity/eslint-config-studio'

export default [...studio]
</file>

<file path="sanity/README.md">
# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
</file>

<file path="sanity/sanity.cli.ts">
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'wj66bxat',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
</file>

<file path="sanity/sanity.config.ts">
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'VICTOR MAYOWA',

  projectId: 'wj66bxat',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
</file>

<file path="sanity/tsconfig.json">
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "Preserve",
    "moduleDetection": "force",
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
</file>

<file path="src/components/dateFormatter.ts">
export const timeAgo = (dateString: string): string => {
  const now = new Date()
  const past = new Date(dateString)
  const diffMs = now.getTime() - past.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  return 'just now'
}
</file>

<file path="src/components/TourOverlay.tsx">
// src/components/TourOverlay.tsx
import React from 'react';
import { useTour } from '../components/TourContext';
import PostCard from './PostCard';
import '../styles/tourOverlay.css';

// Default image maps – same as in BlogFeed (you could also import from a shared config)
const defaultImageMap: Record<string, string> = {
  React: '/defaults/react.png',
  CSS: '/defaults/css.png',
  News: '/defaults/news.png',
  JavaScript: '/defaults/javascript.png',
  Fun: '/defaults/fun.png',
};
const fallbackDefaultImage = '/defaults/default.png';

const TourOverlay: React.FC = () => {
  const { isTourActive, tourPosts, currentIndex, nextPost, prevPost, endTour, loading } = useTour();

  if (!isTourActive || loading || tourPosts.length === 0) return null;

  const currentPost = tourPosts[currentIndex];

  return (
    <div className="tour-overlay">
      <div className="tour-overlay-content">
        <div className="tour-header">
          <span className="tour-lightbulb">💡 Tour</span>
          <button className="tour-close" onClick={endTour}>✕</button>
        </div>

        <div className="tour-card-wrapper">
          <PostCard
            post={currentPost}
            defaultImageMap={defaultImageMap}
            fallbackDefaultImage={fallbackDefaultImage}
          />
        </div>

        <div className="tour-navigation">
          <button
            className="tour-nav-btn"
            onClick={prevPost}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <span className="tour-counter">
            {currentIndex + 1} / {tourPosts.length}
          </span>
          <button
            className="tour-nav-btn"
            onClick={nextPost}
            disabled={currentIndex === tourPosts.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourOverlay;
</file>

<file path="src/components/tourQueries.ts">
// src/constants/tourQueries.ts
export const TOUR_QUERY = `*[_type == "post" && "TOUR" in categories[]->title] | order(publishedAt asc){
  _id,
  title,
  excerpt,
  slug,
  mainImage,
  liveDemoUrl,
  publishedAt
}`;
</file>

<file path="src/styles/tourOverlay.css">
/* src/styles/tour-overlay.css */

.tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tour-overlay-content {
  background: transparent;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1rem;
}

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 1.2rem;
}

.tour-lightbulb {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 1rem;
  border-radius: 30px;
  font-weight: 600;
}

.tour-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.tour-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.tour-card-wrapper {
  margin-bottom: 1rem;
}

.tour-card-wrapper .post-card {
  max-width: 100%;
  background: white;
  border-radius: 12px;
}

.tour-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
}

.tour-nav-btn {
  background: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.tour-nav-btn:hover:not(:disabled) {
  background-color: saddlebrown;
  color: white;
}

.tour-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tour-counter {
  color: white;
  font-weight: 600;
}
</file>

<file path="src/utils/tourStorage.ts">
// src/utils/tourStorage.ts
const TOUR_STORAGE_KEY = 'blog-tour-index';

export const saveTourIndex = (index: number) => {
  localStorage.setItem(TOUR_STORAGE_KEY, index.toString());
};

export const loadTourIndex = (): number | null => {
  const saved = localStorage.getItem(TOUR_STORAGE_KEY);
  return saved ? parseInt(saved, 10) : null;
};

export const clearTourIndex = () => {
  localStorage.removeItem(TOUR_STORAGE_KEY);
};
</file>

<file path="src/App.css">
*{
    font-family: 'Google Sans', sans-serif;
}
</file>

<file path="src/index.css">
*{
    font-family: 'Google Sans', sans-serif;
}
</file>

<file path="eslint.config.js">
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
</file>

<file path="tsconfig.app.json">
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
</file>

<file path="tsconfig.node.json">
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
</file>

<file path="sanity/schemaTypes/post.ts">
import { defineType, defineField } from 'sanity'

export const postSchema = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload an image (optional). If a video link is provided, the image may not be shown.',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'liveDemoUrl',
      title: 'Live Demo URL',
      type: 'url',
      description: 'Paste a YouTube/Vimeo link to embed a video, or any other URL for the "Visit Site" button.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
</file>

<file path="sanity/.gitignore">
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# Dependencies
/node_modules
/.pnp
.pnp.js

# Compiled Sanity Studio
/dist

# Temporary Sanity runtime, generated by the CLI on every dev server start
/.sanity

# Logs
/logs
*.log

# Coverage directory used by testing tools
/coverage

# Misc
.DS_Store
*.pem

# Typescript
*.tsbuildinfo

# Dotenv and similar local-only files
*.local

# my online dashboard: victormayowa.sanity.studio
</file>

<file path="sanity/package.json">
{
  "name": "victor-mayowa",
  "private": true,
  "version": "1.0.0",
  "main": "package.json",
  "license": "UNLICENSED",
  "scripts": {
    "dev": "sanity dev",
    "start": "sanity start",
    "build": "sanity build",
    "deploy": "sanity deploy",
    "deploy-graphql": "sanity graphql deploy"
  },
  "keywords": [
    "sanity"
  ],
  "dependencies": {
    "@sanity/vision": "^5.15.0",
    "react": "^19.1",
    "react-dom": "^19.1",
    "sanity": "^5.12.0",
    "styled-components": "^6.1.18"
  },
  "devDependencies": {
    "@sanity/eslint-config-studio": "^6.0.0",
    "@types/react": "^19.1",
    "eslint": "^9.28",
    "prettier": "^3.5",
    "typescript": "^5.8"
  },
  "prettier": {
    "semi": false,
    "printWidth": 100,
    "bracketSpacing": false,
    "singleQuote": true
  }
}
</file>

<file path="src/styles/blogFeed.css">
/* ===== BLOG FEED STYLES ===== */

/* Main feed container */
.blog-feed {
  background-color: #ffffff;
  padding: 2rem 1rem;
}

/* Sticky search bar */
.search-bar-sticky {
  position: sticky;
  top: 60px; /* adjust based on navbar height */
  background-color: white;
  z-index: 100;
  padding: 1rem 0;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  
  margin: 0 auto;
}

.search-input {
  padding: 0.8rem 1.2rem;
  border: 1px solid #ddd;
  border-radius: 40px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1a1e24;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0;
}

.filter-buttons button {
  background: none;
  border: 1px solid #ddd;
  padding: 0.5rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-buttons button.active {
  background-color: #1a1e24;
  color: white;
  border-color: #1a1e24;
}

.filter-buttons button:hover {
  background-color: #f0f0f0;
}

/* Posts feed – single column */
.posts-feed {
  max-width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Loading and no posts messages */
.loading-message,
.no-posts-message {
  text-align: center;
  padding: 2rem;
  color: #5b6876;
}

/* Responsive for feed */
@media (max-width: 600px) {
  .blog-feed {
    padding: 2rem 1.5rem;
  }
}
</file>

<file path="src/styles/postDetail.css">
/* Post detail page */
.post-detail {
  max-width: 800px;
  margin: 5rem auto;
  padding: 0 1.5rem;
}

.detail-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.post-detail h1 {
  font-size: 2.2rem;
  color: #1a1e24;
  margin-bottom: 0.5rem;
}

.detail-excerpt {
  font-size: 1.2rem;
  color: #5b6876;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.detail-time {
  display: block;
  color: #95a5a6;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.detail-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
}

.detail-body h2,
.detail-body h3 {
  margin: 1.5rem 0 1rem;
  color: #1a1e24;
}

.detail-body p {
  margin-bottom: 1.2rem;
}

.detail-body ul,
.detail-body ol {
  margin-bottom: 1.2rem;
  padding-left: 1.5rem;
}

.detail-body code {
  background: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 2rem;
  color: #5b6876;
}



.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  margin-bottom: 1.5rem;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</file>

<file path="src/utils/useCachedPosts.ts">
import { useState, useEffect } from 'react';
import { client } from '../sanity/client';
import type { SanityImageSource } from '@sanity/image-url';

export interface Post {
  _id: string;
  title: string;
  excerpt: string;
  slug: { current: string };
  categories?: string[];
  mainImage?: SanityImageSource;
  liveDemoUrl?: string;
  publishedAt: string;
}

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  excerpt,
  slug,
  "categories": categories[]->title,
  mainImage,  
  liveDemoUrl,
  publishedAt
}`;

let cachedPosts: Post[] | null = null;
let fetchPromise: Promise<Post[]> | null = null;

export const useCachedPosts = () => {
  const [posts, setPosts] = useState<Post[]>(cachedPosts || []);
  const [loading, setLoading] = useState(!cachedPosts);

  useEffect(() => {
    if (cachedPosts) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosts(cachedPosts);
       
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = client.fetch(POSTS_QUERY).then(data => {
        cachedPosts = data;
        fetchPromise = null;
        return data;
      });
    }

    fetchPromise.then(data => {
       
      setPosts(data);
       
      setLoading(false);
    });
  }, []);

  return { posts, loading };
};
</file>

<file path="README.md">
<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# VICTOR-MAYOWA
Personal portfolio showcasing my web development projects, skills, and experience. Built with modern frontend technologies including React, CSS, and TypeScript, featuring responsive design, interactive UI elements, and clean code practices.
>>>>>>> 271dc3071f4317b60b5ffe721874d798a51ac921
</file>

<file path="tsconfig.json">
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "types": [
      "node",
      "vite/client"
    ]
  }
}
</file>

<file path="sanity/schemaTypes/index.ts">
import { defineType, defineField } from 'sanity'
import { postSchema } from './post'
import { categorySchema } from './category'

// Your existing project schema (defined here, not imported)
export const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Website', value: 'website' },
          { title: 'App', value: 'app' },
          { title: 'UI', value: 'ui' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
      description: 'Link to the live project',
      validation: Rule => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    }),
  ],
})

// Export all schemas together
export const schemaTypes = [projectSchema, postSchema, categorySchema]
</file>

<file path="src/components/TourContext.tsx">
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'; // 👈 type import for ReactNode
import { client } from '../sanity/client';
import type { SanityImageSource } from '@sanity/image-url'; // 👈 simplified import
import { loadTourIndex, saveTourIndex, clearTourIndex } from '../utils/tourStorage';
import { TOUR_QUERY } from '../components/tourQueries';

interface TourPost {
  _id: string;
  title: string;
  excerpt: string;
  slug: { current: string };
  mainImage?: SanityImageSource;
  liveDemoUrl?: string;
  publishedAt: string;
}

interface TourContextType {
  isTourActive: boolean;
  tourPosts: TourPost[];
  currentIndex: number;
  startTour: () => void;
  endTour: () => void;
  nextPost: () => void;
  prevPost: () => void;
  loading: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error('useTour must be used within TourProvider');
  return context;
};

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourPosts, setTourPosts] = useState<TourPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourPosts = async () => {
      try {
        const data = await client.fetch(TOUR_QUERY);
        setTourPosts(data);
        const savedIndex = loadTourIndex();
        if (savedIndex !== null && savedIndex < data.length) {
          setCurrentIndex(savedIndex);
        }
      } catch (error) {
        console.error('Error fetching tour posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTourPosts();
  }, []);

  const startTour = () => setIsTourActive(true);
  const endTour = () => {
    setIsTourActive(false);
    clearTourIndex();
  };

  const nextPost = () => {
    if (currentIndex < tourPosts.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      saveTourIndex(newIndex);
    }
  };

  const prevPost = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      saveTourIndex(newIndex);
    }
  };

  const value = {
    isTourActive,
    tourPosts,
    currentIndex,
    startTour,
    endTour,
    nextPost,
    prevPost,
    loading,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};
</file>

<file path="src/main.tsx">
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
</file>

<file path="src/components/Footer.tsx">
// src/components/Footer.tsx
import React from 'react';
import '../styles/footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Bottom Section: Social Media & Copyright */}
        <div className="footer-bottom">
          
          {/* Social Media Icons */}
          <div className="social-icons">
            <a 
              href="https://github.com/victormayowa185" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="GitHub"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://twitter.com/victormayowa185" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Twitter"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com/in/victor-mayowa-🤓-1317043365" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          
          {/* Copyright */}
          <div className="footer-copyright">
            © 2026 • Open Source • Victor Mayowa
          </div>
          
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
</file>

<file path="src/components/TypewriterText.tsx">
import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === currentWord) {
      // Finished typing – pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && text === '') {
      // Finished deleting – move to next word
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      // Typing or deleting one character
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeout = setTimeout(() => {
        setText((prev) =>
          isDeleting
            ? prev.slice(0, -1)
            : currentWord.slice(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return <span>{text}</span>;
};

export default TypewriterText;
</file>

<file path="src/pages/Project.tsx">
import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { client } from '../sanity/client';
import '../styles/project.css';

interface Project {
  logoUrl: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  category: 'website' | 'app' | 'ui' | 'other';
  projectUrl: string
}

const PROJECTS_QUERY = `*[_type == "project"]{
  title,
  description,
  tags,
  category,
  "logoUrl": logo.asset->url,
  "imageUrl": image.asset->url,
  projectUrl            
}`;

const categories = ['All', 'Website', 'App', 'UI'];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    client.fetch(PROJECTS_QUERY)
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Sanity fetch error:', err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.category === activeFilter.toLowerCase();
  });

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <p>
          A selection of my recent work across web, mobile, and user interfaces.
          Each project reflects a unique challenge and solution.
        </p>
      </div>

      <div className="filter-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={activeFilter === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="loading-message">Loading projects...</p>}

      {!loading && (
        <>
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.title}
                logoUrl={project.logoUrl}
                title={project.title}
                description={project.description}
                tags={project.tags}
                imageUrl={project.imageUrl}
                projectUrl={project.projectUrl} // 👈 pass new prop
              />
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <p className="no-projects-message">Project in this category is yet to be deployed.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
</file>

<file path="src/styles/footer.css">
/* src/styles/footer.css */

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: 'Mulish', sans-serif;
}

.footer {
  background: rgba(255, 255, 255, 0.95);
  color: black;
  padding: 4rem 2rem 2rem;
  width: 100%;
  margin-top: auto;
  box-sizing: border-box;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ---------- TOP SECTION ---------- */
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.footer-left {
  flex: 1;
  min-width: 280px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: black;
}

.footer-logo .logo-icon {
  font-size: 1.8rem;
  animation: spin 7s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.footer-tagline {
  font-size: 1rem;
  color: black;
  line-height: 1.6;
  max-width: 400px;
}

/* ---------- LINK COLUMNS ---------- */
.footer-right {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

.footer-column {
  min-width: 150px;
}

.footer-column-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: black;
}

.footer-links-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-link {
  color: black;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.footer-link:hover {
  color: saddlebrown;
  transform: translateX(5px);
}

/* ---------- BOTTOM SECTION ---------- */
.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding-top: 2rem;
}

.social-icons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  transition: all 0.3s;
  text-decoration: none;
}

.social-icon:hover {
  background: saddlebrown;
  color: white;
  transform: translateY(-3px);
}

.social-icon svg {
  width: 20px;
  height: 20px;
}

.footer-copyright {
  color: black;
  font-size: 0.9rem;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  padding: 0 0.5rem;
}

/* ---------- RESPONSIVE (TABLET) ---------- */
@media (max-width: 1024px) {
  .footer-right {
    gap: 2rem;
  }

  .footer-column {
    min-width: 130px;
  }
}

/* ---------- RESPONSIVE (MOBILE) ---------- */
@media (max-width: 768px) {
  .footer {
    padding: 3rem 1.5rem 1.5rem;
  }

  .footer-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2.5rem;
  }

  .footer-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100%;
  }

  .footer-tagline {
    margin: 0 auto;
  }

  .footer-right {
    justify-content: center;
    width: 100%;
    gap: 2rem;
  }

  .footer-column {
    min-width: 140px;
    text-align: center;
  }

  .footer-links-group {
    align-items: center;
  }
}

/* ---------- RESPONSIVE (SMALL PHONES, ≤ 480px) ---------- */
@media (max-width: 480px) {
  .footer {
    padding: 2.5rem 1rem 1.5rem;
  }

  .footer-top {
    gap: 2rem;
  }

  .footer-right {
    flex-direction: column;        /* stack columns vertically */
    align-items: center;
    gap: 1.5rem;
  }

  .footer-column {
    min-width: auto;
    width: 100%;
    max-width: 240px;
    padding: 0 !important;          /* remove any side padding */
    text-align: center;
  }

  .footer-column-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .footer-links-group {
    align-items: center;
  }

  .social-icons {
    gap: 1rem;
  }

  .social-icon {
    width: 36px;
    height: 36px;
  }

  .social-icon svg {
    width: 18px;
    height: 18px;
  }

  .footer-copyright {
    font-size: 0.8rem;
    padding: 0 0.25rem;
  }
}

/* ---------- EXTRA TINY SCREENS (≤ 360px) ---------- */
@media (max-width: 360px) {
  .footer {
    padding: 2rem 0.75rem 1rem;
  }

  .social-icon {
    width: 32px;
    height: 32px;
  }

  .footer-copyright {
    font-size: 0.75rem;
  }
}
</file>

<file path="index.html">
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
    rel="stylesheet">
  <meta name="google-adsense-account" content="ca-pub-1638893405317554">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mayowa Portfolio</title>


  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">


  <style>
    /* Full‑screen white background */
    .loading-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    /* Circular container for the images */
    .loader {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: #f0f0f0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Image animation: pop in, then shrink away */
    .loader img {
      width: 80%;
      height: auto;
      object-fit: contain;
      animation: popInShrink 1.5s cubic-bezier(0.4, 1.5, 0.6, 1) forwards;
    }

    @keyframes popInShrink {
      0% {
        transform: scale(0.2);
        opacity: 0;
      }

      50% {
        transform: scale(1.1);
        opacity: 1;
      }

      100% {
        transform: scale(0);
        opacity: 0;
      }
    }
  </style>
</head>

<body>
  <!-- React will mount here; the loader will be replaced once React renders -->
  <div id="root">
    <div class="loading-container" id="loading-container">
      <div class="loader">
        <img id="loader-image" src="/logo1.png" alt="Loading...">
      </div>
    </div>
  </div>

  <script type="module" src="/src/main.tsx"></script>

  <!-- Small script to cycle through images while loading -->
  <script>
    // Replace these with the paths to your actual images (put them in the public folder)
    const images = [
      '/logo1.png',
      '/logo2.png',
      '/logo3.png'
    ];
    let index = 0;
    const imgElement = document.getElementById('loader-image');

    function nextImage() {
      index = (index + 1) % images.length;
      imgElement.src = images[index];
      imgElement.style.animation = 'none';
      imgElement.offsetHeight;
      imgElement.style.animation = 'popInShrink 3.5s cubic-bezier(0.4, 1.5, 0.6, 1) forwards';
    }


    setInterval(nextImage, 1000);
  </script>
</body>

</html>
</file>

<file path="src/pages/About.tsx">
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MdOutlineLaptopMac } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoColorPalette } from "react-icons/io5";
import { LuTabletSmartphone } from "react-icons/lu";
import '../styles/about.css';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Victor Mayowa – Web Developer & Designer</title>
        <meta
          name="description"
          content="Learn about Victor Mayowa, a creative web developer with 2+ years experience in React, TypeScript, and modern CSS. Based in Nigeria, focused on building practical projects."
        />
      </Helmet>

      <div className="con">
        <div className="about-container">
          <div className="about-bio">
            <h1 className="about-name">Victor Mayowa</h1>
            <p className="about-title">Creative Web Developer & Designer</p>
            <div className="about-divider"></div>
            <p className="about-text">
              I'm a web developer with a passion for crafting beautiful, functional digital experiences.
              With over 2 years of experience in front-end and full-stack development, I specialize in
              React, TypeScript, and modern CSS. I believe in writing clean, maintainable code and designing
              interfaces that users love.
            </p>
            <p className="about-text">
              Based in Nigeria, I focus on building practical projects that simulate real startup and business needs.
              When I'm not coding, you'll find me dancing, or experimenting with new technologies.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">2+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
            </div>
            <a href="/contact" className="about-cta">Let's Work Together</a>
          </div>
        </div>

        <div className="skills-section">
          <h2 className="skills-title">What I Do</h2>
          <div className="skills-grid">
            <div className="skill-card">
              <MdOutlineLaptopMac className='skill-icon' />
              <h3>Frontend Development</h3>
              <p>React, Vue, TypeScript, responsive design, and interactive interfaces.</p>
            </div>
            <div className="skill-card">
              <IoSettingsOutline className='skill-icon' />
              <h3>Backend & APIs</h3>
              <p>Node.js, Express, RESTful APIs, and database integration.</p>
            </div>
            <div className="skill-card">
              <IoColorPalette className='skill-icon' />
              <h3>UI/UX Design</h3>
              <p>From wireframes to high-fidelity prototypes, focusing on user experience.</p>
            </div>
            <div className="skill-card">
              <LuTabletSmartphone className='skill-icon' />
              <h3>Mobile-First</h3>
              <p>Building apps that work seamlessly across all devices.</p>
            </div>
          </div>
        </div>

        <div className="experience-section">
          <h2 className="experience-title">Experience & Achievements</h2>
          <div className="timeline">

            <div className="timeline-item">
              <div className="timeline-left">
                <span className="timeline-year">2024 – Present</span>
              </div>
              <div className="timeline-right">
                <h3>Frontend Web Developer (Projects)</h3>
                <p>
                  Actively building modern, responsive web projects using HTML, CSS, JavaScript,
                  and React. Focused on clean UI, performance, and maintainable code.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-left">
                <span className="timeline-year">2024 – Present</span>
              </div>
              <div className="timeline-right">
                <h3>Personal & Practice Projects</h3>
                <p>
                  Developing hands-on projects that simulate real-world use cases, including
                  portfolio websites, landing pages, and interactive interfaces.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-left">
                <span className="timeline-year">Aug 2025</span>
              </div>
              <div className="timeline-right">
                <h3>Google Developer Program</h3>
                <p>Joined the Google Developer Program – an official recognition of engagement with Google’s developer ecosystem.</p>
                <a href="https://developers.google.com/profile/u/victormayowa185" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/badge1.png"
                    alt="Google Developer Program badge"
                    className="badge-img"
                    loading="lazy"
                  />
                </a>
                <p className="badge-note">Click the badge to view it on my Google Developer profile.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-left">
                <span className="timeline-year">Nov 2025</span>
              </div>
              <div className="timeline-right">
                <h3>Google Developer Group Discovery</h3>
                <p>
                  Discovered and joined a Google Developer Group (GDG) account – connecting with local
                  developer communities and staying updated on tech events and initiatives.
                </p>
                <a href="https://developers.google.com/profile/u/victormayowa185" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/badge2.png"
                    alt="Google Developer Group badge"
                    className="badge-img"
                    loading="lazy"
                  />
                </a>
                <p className="badge-note">Click the badge to view it on my Google Developer profile.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-left">
                <span className="timeline-year">Mar 2026</span>
              </div>
              <div className="timeline-right">
                <h3>Chrome DevTools User</h3>
                <p>
                  Earned the Chrome DevTools User badge by opening Chrome DevTools and inspecting a website.
                  This badge reflects hands‑on familiarity with the browser’s developer tools – essential for
                  debugging and performance optimisation.
                </p>
                <a href="https://developers.google.com/profile/u/victormayowa185" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/badge3.png"
                    alt="Chrome DevTools badge"
                    className="badge-img"
                    loading="lazy"
                  />
                </a>
                <p className="badge-note">Click the badge to view it on my Google Developer profile.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default About;
</file>

<file path="src/pages/PostDetail.tsx">
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import { client, urlFor } from '../sanity/client';
import { timeAgo } from '../components/dateFormatter';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@sanity/types';
import type { SanityImageSource } from '@sanity/image-url';
import '../styles/postDetail.css';

interface Post {
  title: string;
  excerpt: string;
  body: PortableTextBlock[];
  mainImage?: SanityImageSource;
  liveDemoUrl?: string;
  publishedAt: string;
}

// Helper to detect and convert video URLs
const getVideoEmbedUrl = (url: string) => {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
};

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const query = `*[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt,
        body,
        mainImage,
        liveDemoUrl,
        publishedAt
      }`;
      const data = await client.fetch(query, { slug });
      setPost(data);
      setLoading(false);
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <p className="loading-message">Loading post...</p>;
  if (!post) return <p className="error-message">Post not found</p>;

  const videoEmbedUrl = post.liveDemoUrl ? getVideoEmbedUrl(post.liveDemoUrl) : null;

  // Build absolute URLs for meta tags
  const postUrl = `${window.location.origin}/post/${slug}`;
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).url()
    : `${window.location.origin}/default-og-image.png`; // fallback – replace with your actual default image path

  return (
    <>
      <Helmet>
        {/* Standard meta tags */}
        <title>{post.title} | Victor Mayowa's Blog</title>
        <meta name="description" content={post.excerpt} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Victor Mayowa's Blog" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <article className="post-detail">
        {/* Video or Image – video takes priority */}
        {videoEmbedUrl ? (
          <div className="video-wrapper">
            <iframe
              src={videoEmbedUrl}
              title={post.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          post.mainImage && (
            <img
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              className="detail-image"
            />
          )
        )}

        <h1>{post.title}</h1>
        <p className="detail-excerpt">{post.excerpt}</p>
        <time className="detail-time">{timeAgo(post.publishedAt)}</time>

        {/* Show "Visit Site" button only if it's not a video link */}
        {post.liveDemoUrl && !videoEmbedUrl && (
          <a
            href={post.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-site-btn"
          >
            Visit Site
          </a>
        )}

        <div className="detail-body">
          {post.body ? (
            <PortableText value={post.body} />
          ) : (
            <p>This post has no content yet.</p>
          )}
        </div>
      </article>
    </>
  );
};

export default PostDetail;
</file>

<file path="src/sanity/client.ts">
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error('Missing VITE_SANITY_PROJECT_ID environment variable');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-13',
  useCdn: true,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);
</file>

<file path="src/styles/postCard.css">
.post-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

/* Header row – love button */
.post-card-header {
  padding: 0.75rem 1rem 0 1rem;
  display: flex;
  justify-content: flex-start;
}

.love-button {
  background: transparent;
  /* transparent background */
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.love-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  /* subtle hover effect */
}

.love-button svg {
  width: 24px;
  height: 24px;
}

/* Main row – image + text */
.post-card-main {
  display: flex;
  gap: 1.5rem;
  padding: 0 1rem 1rem 1rem;
}

/* Image wrapper */
.post-card-main .post-image-wrapper {
  flex: 0 0 40% !important;
  height: 250px;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
}

.post-card-main .post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}



.post-image.animate-image {
  animation: slideUpPauseRightReset 5s ease-in-out infinite;
}

@keyframes slideUpPauseRightReset {
  0% {
    transform: translateY(100%) translateX(0);
  }

  25% {
    transform: translateY(0) translateX(0);
  }

  75% {
    transform: translateY(0) translateX(0);
  }

  87.5% {
    transform: translateY(0) translateX(100%);
  }

  93.75% {
    transform: translateY(100%) translateX(100%);
  }

  100% {
    transform: translateY(100%) translateX(0);
  }
}


.heart {
  position: absolute;
  font-size: 2rem;
  pointer-events: none;
  animation: floatHeart 1s ease-out forwards;
  transform: translate(-50%, -50%);
}

@keyframes floatHeart {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1.5);
  }
}

/* Content side */
.post-card-main .post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.post-card-main .post-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  color: #1a1e24;
}

.post-card-main .excerpt {
  color: #5b6876;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.post-card-main .post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.post-card-main .action-buttons {
  display: flex;
  gap: 0.8rem;
}

.post-card-main .external-link-btn {
  background-color: #1a1e24;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.post-card-main .external-link-btn:hover {
  background-color: saddlebrown;
}

.post-card-main .share-btn {
  background-color: transparent;
  border: 1px solid #1a1e24;
  color: #1a1e24;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.post-card-main .share-btn:hover {
  background-color: #1a1e24;
  color: white;
}

.post-card-main .timestamp {
  color: #95a5a6;
  font-size: 0.85rem;
}

/* Image position variants */
.post-card-main.image-right .post-image-wrapper {
  order: 1;
}

.post-card-main.image-left .post-image-wrapper {
  order: 2;
}

.post-card-main.image-left .post-content {
  margin-left: 1rem;
}

/* Responsive for small screens */
@media (max-width: 600px) {

  .post-card-main .post-image-wrapper,
  .post-card-main .post-content {
    order: 0 !important;
 
  }

  .post-card-main {
    flex-direction: column;
  }

  .post-card-main .post-image-wrapper {
    flex: 0 0 auto;
    width: 100%;
    height: 200px;
  }

  .post-card-main.image-left .post-content {
    margin-left: 0;
  }

  .post-card-main .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</file>

<file path="vercel.json">
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
</file>

<file path="vite.config.ts">
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update the service worker
      manifest: {
        name: 'Victor Mayowa - Web Developer Portfolio',
        short_name: 'VM Portfolio',
        description: 'Portfolio of Victor Mayowa, a creative web developer and designer.',
        theme_color: '#1a1e24', // Match your site's theme
        background_color: '#ffffff',
        display: 'standalone', // Makes it open like a native app
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
       maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'], // Cache these file types
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i, // Cache leaflet CSS/JS from CDN
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-cdn-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/, // Cache images
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/victormayowa\.vercel\.app\/api\/.*/i, // Your API calls
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 5
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    }
  }
})
</file>

<file path="src/components/Navbar.tsx">
// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* 👇 Replace this span with logo + text */}
        <div className="brand-logo-wrapper">
          <img src="/logo.png" alt="MAYO X Logo" className="brand-logo-img" />
       
        </div>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <HiX /> : <HiMenu />}
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
        <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
        <li><NavLink to="/projects" onClick={closeMenu}>Projects</NavLink></li>
        <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
        <li><NavLink to="/blog" onClick={closeMenu}>Blog</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
</file>

<file path="src/styles/projectCard.css">
/* General Body Styles */
body {
  background-color: #f9fafb;
  font-family: mulish;
  margin: 0;
}

/* App Container */
.portfolio-app {
  min-height: 100vh;
}

/* Page Header */
.page-header {
  color: white;
  padding: 3rem 1rem;
}

.page-header-content {
  max-width: 80rem;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 2.25rem;
  font-weight: bold;
}

.page-header p {
  margin-top: 0.5rem;
  font-size: 1.125rem;
  color: #dbeafe;
}

/* Main Content */
.main-content {
  padding: 3rem 0;
}

.main-content-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.filter-tabs-container {
  display: flex;
  gap: 0.5rem;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.filter-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s, color 0.2s;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: #4b5563;
}

.filter-button:hover {
  background-color: #f3f4f6;
}

.filter-button.active {
  color: white;
}

/* Project Grid */
.project-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

/* Project Card */
.project-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.project-card .image-container {
  position: relative;
  overflow: hidden; /* keeps the animation contained */
}

/* Slide-up animation */
@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card .project-image {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  animation: slideUp 0.6s ease forwards; /* runs once on load */
}

.project-card .image-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-card .logo-image {
  height: 3rem;
  width: auto;
}

.project-card .card-content {
  padding: 1.5rem;
}

.project-card .card-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.project-card .card-content p {
  color: #4b5563;
  margin-bottom: 1rem;
}

.project-card .tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-card .tag {
  background-color: #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

/* Make the entire card a block link */
.project-card .card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* Hover overlay */
.project-card .hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 1s ease;
  z-index: 10;
}

.project-card:hover .hover-overlay {
  opacity: 1;
}

.project-card:hover .project-image {
  filter: blur(2px);
  transition: filter 0.3s ease;
}

.project-card .visit-button {
  background-color: white;
  color: black;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, background-color 0.2s;
}

.project-card .visit-button:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.project-card .card-link::after {
  content: none !important;
}

/* Responsive Grid */
@media (min-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .main-content-container {
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</file>

<file path="src/pages/ProjectCard.tsx">
import type { FC } from 'react'; 
import '../styles/projectCard.css';

interface ProjectCardProps {
  logoUrl?: string;       // optional if you might use it later; otherwise remove entirely
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl: string;
}

const ProjectCard: FC<ProjectCardProps> = ({ 
  title, 
  description, 
  tags, 
  imageUrl, 
  projectUrl 
}) => {
  const safeTitle = title || 'untitled';
  const cardId = `project-card-${safeTitle.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div id={cardId} className="project-card">
      <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="card-link">
        <div className="image-container">
          <img 
            src={imageUrl} 
            alt={title || 'project image'} 
            className="post-image" 
            referrerPolicy="no-referrer" 
          />
          <div className="hover-overlay">
            <button className="visit-button">Visit</button>
          </div>
        </div>
        <div className="card-content">
          <h3>{title || 'Untitled Project'}</h3>
          <p>{description || ''}</p>
          <div className="tags-container">
            {tags && tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProjectCard;
</file>

<file path="src/styles/contact.css">
/* ContactPage.css - Fully responsive & mobile-first */

@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800&display=swap');

* {
  font-family: 'Mulish', sans-serif;
  box-sizing: border-box;
}

.cen {
  display: flex;
 gap: 2%;
  align-items: center;
}

/* ---------- Page Background with Moving Gradients ---------- */
.contact-page {
  background-color: #ffffff;
  background-image:
    radial-gradient(circle at 50% 50%, rgba(78, 205, 196, 0.5) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 107, 107, 0.5) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 230, 109, 0.5) 0%, transparent 50%);
  background-size: 200% 100%, 200% 100%, 200% 100%;
  background-position: 0% 50%, 20% 50%, 40% 50%;
  background-repeat: no-repeat;
  animation: moveGradients 1.9s infinite alternate ease-in-out;
}

/* ===== Base & Wrapper with animated gradients ===== */
.con {
  position: relative;
  overflow: hidden;

}

@keyframes moveGradients {
  0% {
    background-position: -20% 50%, 0% 50%, 20% 50%;
  }
  100% {
    background-position: 120% 50%, 140% 50%, 160% 50%;
  }
}

/* Slower animation on mobile for performance */
@media (max-width: 768px) {
  .contact-page {
    animation-duration: 2s;
  }
}

/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  .contact-page {
    animation: none;
  }
}

@keyframes moveGradients {
  0% {
    background-position: 0% 50%, 20% 50%, 40% 50%;
  }

  100% {
    background-position: 100% 50%, 80% 50%, 60% 50%;
  }
}

/* ---------- Map Section ---------- */
.map-section {
  width: 100%;
  height: clamp(280px, 40vh, 380px);
  /* Fluid height */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  border-bottom: 4px solid white;
  animation: fadeInUp 0.9s ease;
}

.map-section .leaflet-container {
  width: 100%;
  height: 100%;
  border-radius: 0 0 20px 20px;
  z-index: 5;
}

/* ---------- Hero Section ---------- */
.heroc {
  max-width: 800px;
  margin: clamp(2rem, 6vw, 3rem) auto clamp(1.5rem, 4vw, 2rem);
  text-align: center;
  padding: 0 1.5rem;
  animation: fadeInUp 0.8s 0.1s forwards;
  opacity: 0;
}

.heroc h1 {
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(145deg, #0f2b3d, #1e4a6f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: black;
  /* fallback for older browsers */
  background-clip: text;
  margin-bottom: 0.6rem;
  line-height: 1.2;
}

.heroc p {
  font-size: clamp(1rem, 3vw, 1.3rem);
  color: #475569;
  font-weight: 400;
}

/* ---------- Contact Grid (Form + Video) ---------- */
.contact-grid {
  max-width: 1280px;
  margin: 3rem auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: start;
  animation: fadeInUp 0.8s 0.2s forwards;
  opacity: 0;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 20px 35px -8px rgba(0, 34, 64, 0.1);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
  width: 100%;
}

.form-card h2 {
  font-size: clamp(1.5rem, 4vw, 1.8rem);
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #0b253a;
}

.form-card .sub {
  margin-bottom: clamp(1.5rem, 3vw, 2.2rem);
  color: #475569;
  font-size: 1rem;
}

/* Form Groups */
.form-group {
  margin-bottom: clamp(1.2rem, 2.5vw, 1.8rem);
}

.form-group label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1e293b;
  display: block;
  margin-bottom: 0.5rem;
  letter-spacing: 0.3px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  max-width: 480px;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.2rem);
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  font-family: 'Mulish', sans-serif;
  font-size: 1rem;
  background: white;
  transition: all 0.2s;
  outline: none;
  -webkit-appearance: none;
  /* removes default iOS styling */
  appearance: none;
}

/* Larger touch target for selects on mobile */
@media (max-width: 600px) {

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.9rem 1rem;
    font-size: 16px;
    /* prevents zoom on focus in iOS */
  }
}

.form-group select {
  max-width: 520px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.15);
}

.form-group input:valid,
.form-group select:valid,
.form-group textarea:valid {
  border-color: #86efac;
}

.form-group input:invalid:not(:placeholder-shown),
.form-group textarea:invalid:not(:placeholder-shown) {
  border-color: #fca5a5;
}

.required-star {
  color: #dc2626;
  margin-left: 2px;
}

/* Submit Button */
.submit-btn {
  background: linear-gradient(135deg, #1e3a5f, #152f4a);
  color: white;
  border: none;
  padding: clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  font-size: clamp(1rem, 3vw, 1.2rem);
  font-weight: 600;
  border-radius: 60px;
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.3s;
  box-shadow: 0 12px 28px -8px #1e3a5f70;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 2rem;
  touch-action: manipulation;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #143250, #0e2640);
  transform: scale(1.02);
  box-shadow: 0 20px 30px -5px #0b2b4e;
}

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn svg {
  font-size: 1.2rem;
  transition: transform 0.2s;
}

.submit-btn:hover svg {
  transform: translateX(5px);
}

/* Image/Video Side */
.image-side {
  background: linear-gradient(145deg, #d4e2f0, #bdd3e8);
  border-radius: 10px;
  box-shadow: 0 25px 40px -12px #1f3a5f40;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  max-height: 500px;
  /* aspect-ratio: 16 / 9; */
  /* ensures consistent ratio */
  width: 100%;
}

.contact-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.contact-image {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 20px;
}

/* ---------- Direct Contact Row ---------- */
.direct-contact {
  max-width: 1280px;
  margin: 1rem auto 3rem;
  padding: 0 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(1rem, 4vw, 2.5rem);
  backdrop-filter: blur(8px);
  border-radius: 80px;
  padding: clamp(1rem, 3vw, 1.4rem) clamp(1.5rem, 4vw, 2.5rem);
  box-shadow: 0 8px 22px #e2e8f0;
  animation: fadeInUp 1.8s 0.3s forwards;
  opacity: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  font-weight: 500;
  color: #1e293b;
  transition: transform 0.2s;
}

.contact-item svg {
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  color: #1e4a6f;
  transition: color 0.2s, transform 0.2s;
}

.contact-item:hover svg {
  color: #3b82f6;
  transform: scale(1.1);
}

.contact-item a {
  text-decoration: none;
  color: #1e293b;
  border-bottom: 1px dotted transparent;
  transition: border-color 0.2s;
  word-break: break-word;
  /* prevent long email overflow */
}

.contact-item a:hover {
  border-bottom: 1px dotted #3b82f6;
}

/* ---------- CTA Footer ---------- */
.cta-footer {
  background: #0a1a2b;
  color: white;
  border-radius: 60px 60px 0 0;
  padding: clamp(2rem, 6vw, 3.5rem) clamp(1rem, 4vw, 2rem);
  text-align: center;
  margin-top: 2rem;
  animation: fadeInUp 0.8s 0.4s forwards;
  opacity: 0;
}

.cta-footer h2 {
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff, #e0f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-footer .cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: white;
  color: #0f2b3d;
  padding: clamp(0.8rem, 2.5vw, 1.1rem) clamp(1.5rem, 4vw, 3rem);
  border-radius: 60px;
  font-weight: 700;
  font-size: clamp(1rem, 3vw, 1.3rem);
  text-decoration: none;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.25);
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.5);
  touch-action: manipulation;
}

.cta-footer .cta-button:hover {
  background: #eef7ff;
  transform: scale(1.05);
  box-shadow: 0 25px 35px rgba(0, 0, 0, 0.35);
}

.cta-footer .cta-button:active {
  transform: scale(0.98);
}

.cta-footer .cta-button svg {
  transition: transform 0.2s;
}

.cta-footer .cta-button:hover svg {
  transform: translateX(7px);
}

.cta-footer .footnote {
  margin-top: 2rem;
  color: #a5b8cf;
  font-size: 0.9rem;
}

/* ---------- Form Status Messages ---------- */
.form-message {
  padding: 1rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
  animation: fadeInUp 0.3s ease;
}

.form-message.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.form-message.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}


/* Shake animation */
@keyframes shake {
  0% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-8px);
  }

  40% {
    transform: translateX(10px);
  }

  60% {
    transform: translateX(-4px);
  }

  80% {
    transform: translateX(6px);
  }

  100% {
    transform: translateX(0);
  }
}

.shake {
  animation: shake 0.5s ease-in-out;
}

/* ---------- Animations ---------- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduce motion if requested */
@media (prefers-reduced-motion: reduce) {

  .map-section,
  .heroc,
  .contact-grid,
  .direct-contact,
  .cta-footer,
  .form-message {
    animation: none;
    opacity: 1;
  }
}

/* ---------- Responsive Breakpoints ---------- */

/* Tablets and below (≤ 900px) */
@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .image-side {
    max-height: 400px;
    order: -1;
    /* video on top for mobile if desired */
  }

  .direct-contact {
    border-radius: 40px;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .contact-item {
    justify-content: center;
  }
}

/* Small tablets and large phones (≤ 600px) */
@media (max-width: 600px) {
  .map-section {
    height: 250px;
  }

  .heroc h1 {
    font-size: 2rem;
  }

  .heroc p {
    font-size: 1.1rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .image-side {
    max-height: 300px;
  }

  .direct-contact {
    padding: 1rem 1.5rem;
    gap: 1.2rem;
  }

  .contact-item {
    font-size: 0.95rem;
  }

  .cta-footer h2 {
    font-size: 1.6rem;
  }

  .cta-footer .cta-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}

/* Very small phones (≤ 400px) */
@media (max-width: 400px) {
  .map-section {
    height: 200px;
  }

  .heroc h1 {
    font-size: 1.6rem;
  }

  .heroc p {
    font-size: 0.95rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.8rem 0.9rem;
    font-size: 0.95rem;
  }

  .submit-btn {
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
  }

  .direct-contact {
    padding: 0.8rem 1rem;
    gap: 0.8rem;
  }

  .contact-item svg {
    font-size: 1.3rem;
  }

  .cta-footer {
    padding: 1.5rem 1rem;
  }

  .cta-footer h2 {
    font-size: 1.4rem;
  }

  .cta-footer .cta-button {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
}

/* Landscape orientation on mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .map-section {
    height: 200px;
  }

  .contact-grid {
    gap: 1.5rem;
  }

  .image-side {
    max-height: 250px;
  }

  .direct-contact {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* High-resolution screens (optional) */
@media (min-width: 1440px) {

  .contact-grid,
  .direct-contact {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }
}
</file>

<file path="src/components/PostCard.tsx">
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlFor } from '../sanity/client';
import { timeAgo } from '../components/dateFormatter';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import type { SanityImageSource } from '@sanity/image-url';
import '../styles/postCard.css';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    excerpt: string;
    slug: { current: string };
    categories?: string[];
    mainImage?: SanityImageSource;
    liveDemoUrl?: string;
    publishedAt: string;
  };
  defaultImageMap: Record<string, string>;
  fallbackDefaultImage: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, defaultImageMap, fallbackDefaultImage }) => {
  const navigate = useNavigate();
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [loved, setLoved] = useState(false);
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // ✅ fixed

  const hasUploadedImage = !!post.mainImage;
  const imageSrc = hasUploadedImage
    ? urlFor(post.mainImage!).width(400).height(250).url()
    : (post.categories && post.categories[0] && defaultImageMap[post.categories[0]]) || fallbackDefaultImage;

  const handleCardClick = () => {
    if (navigateTimeoutRef.current) return;
    navigateTimeoutRef.current = setTimeout(() => {
      navigate(`/post/${post.slug.current}`);
      navigateTimeoutRef.current = null;
    }, 200);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (navigateTimeoutRef.current) {
      clearTimeout(navigateTimeoutRef.current);
      navigateTimeoutRef.current = null;

      setLoved(prev => !prev);

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newHeart = { id: Date.now(), x, y };
      setHearts(prev => [...prev, newHeart]);
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    } else {
      navigateTimeoutRef.current = setTimeout(() => {
        navigate(`/post/${post.slug.current}`);
        navigateTimeoutRef.current = null;
      }, 200);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.slug.current}`;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url });
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
    }
  };

  const handleLoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoved(prev => !prev);
  };

  const imagePositionClass = hasUploadedImage ? 'image-right' : 'image-left';

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-card-header">
        <button className="love-button" onClick={handleLoveClick}>
          {loved ? <FaHeart color="black" /> : <FiHeart color="black" />}
        </button>
      </div>

      <div className={`post-card-main ${imagePositionClass}`}>
        <div className="post-image-wrapper" onClick={handleImageClick}>
          <img src={imageSrc} alt={post.title} className="post-image animate-image" />
          {hearts.map(heart => (
            <span key={heart.id} className="heart" style={{ left: heart.x, top: heart.y }}>❤️</span>
          ))}
        </div>

        <div className="post-content">
          <h3>{post.title}</h3>
          <p className="excerpt">{post.excerpt}</p>
          <div className="post-footer">
            <div className="action-buttons">
              {post.liveDemoUrl && (
                <a
                  href={post.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link-btn"
                  onClick={e => e.stopPropagation()}
                >
                  Visit Site
                </a>
              )}
              <button className="share-btn" onClick={handleShare}>
                Share
              </button>
            </div>
            <span className="timestamp">{timeAgo(post.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
</file>

<file path="src/pages/Blog.tsx">
import React, { useRef, useState, useEffect } from 'react';
import { useTour } from '../components/TourContext';
import { FaLaptopCode } from "react-icons/fa6";
import { FiMousePointer } from "react-icons/fi";
import { IoGitMergeOutline } from "react-icons/io5";
import TypewriterText from '../components/TypewriterText';
import { TbNetwork } from "react-icons/tb";
import { TbLocationStar } from "react-icons/tb";
import BlogFeed from '../components/BlogFeed';
import '../styles/blog.css';

const Hero: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const [side, setSide] = useState<'left' | 'right' | null>(null);
    const { startTour } = useTour(); 

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;

        const handleMouseMove = (e: MouseEvent) => {
            const viewportWidth = window.innerWidth;
            const mouseX = e.clientX;
            setSide(mouseX < viewportWidth / 2 ? 'left' : 'right');
        };

        const handleMouseLeave = () => {
            setSide(null);
        };

        hero.addEventListener('mousemove', handleMouseMove);
        hero.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            hero.removeEventListener('mousemove', handleMouseMove);
            hero.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const topWords = ['Creative', 'Innovative', 'Passionate', 'Detail-Oriented'];
    const bottomWords = ['5+ years', '10+ projects', '3 startups', '20+ repos'];

    return (
        <div>
            <h1 className="visually-hidden">Victor Mayowa – Web Developer & Designer Blog</h1>

            <div ref={heroRef} className="hero" aria-label="Interactive hero section with mouse‑sensitive blur effect">
                <div className="hero-grid">
                    {/* Left column – artistic name */}
                    <div className={`left-column ${side === 'right' ? 'blur' : ''}`}>
                        <div className='hero-name-art'>
                            <img src="VIC.png" alt="Artistic logo of Victor Mayowa's name" />
                        </div>
                        <div className="button-group">
                            <button className="hero-button" onClick={startTour} aria-label="Start guided tour of the blog">
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Right column – unchanged */}
                    <div className={`right-column ${side === 'left' ? 'blur' : ''}`}>
                        <div className="right-content">
                            <div className="image-wrapper">
                                <div className="image-circle">
                                    <img src="/pic2.png" alt="Profile portrait of Victor Mayowa" className="profile-image" />
                                </div>
                                <div className="rect rect-top-right">
                                    <TbLocationStar aria-hidden="true" /> <TypewriterText words={topWords} />
                                </div>
                                <div className="rect rect-bottom-left">
                                    <TbNetwork aria-hidden="true" /> <TypewriterText words={bottomWords} />
                                </div>
                            </div>
                            <div className="icon-circles-vertical">
                                <FiMousePointer className="icon-circle" aria-label="Mouse pointer icon" />
                                <FaLaptopCode className="icon-circle" aria-label="Laptop code icon" />
                                <IoGitMergeOutline className="icon-circle" aria-label="Git merge icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlogFeed />
        </div>
    );
};

export default Hero;
</file>

<file path="src/styles/about.css">
/* ===== Base & Wrapper with animated gradients ===== */
.con {
  position: relative;
  overflow: hidden;
  background-color:white;
  padding-bottom: 2rem;
}



/* ===== About Container (bio only, no image) ===== */
.about-container {
  display: flex;
  margin: 0 auto;
  padding: 5rem 4rem;
  position: relative;
  z-index: 1;
}


.about-bio {
  flex: 1;
}

.about-name {
  font-size: 1.9rem;
  font-weight: 600;
  color: #1a1e24;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.about-title {
  font-size: 1.2rem;
  color: black;
  font-weight: 300;
}

.about-divider {
  width: clamp(60px, 10vw, 80px);
  height: 4px;
  background: linear-gradient(90deg, #031e3d);
  margin: 1.5rem 0;
}

.about-text {
  font-size: clamp(0.95rem, 3vw, 1.1rem);
  line-height: 1.8;
  color: #5b6876;
}

.about-stats {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(1rem, 4vw, 2rem);
  margin: clamp(1.5rem, 4vw, 2rem) 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  min-width: 120px;
  /* ensures they don't get too small */
}

.stat-number {
  font-size: clamp(1.6rem, 5vw, 2rem);
  font-weight: 700;
  color: #1a1e24;
  line-height: 1.2;
}

.stat-label {
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  color: #7a8b9b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.about-cta {
  display: inline-block;
  background: #1a1e24;
  color: white;
  padding: clamp(0.7rem, 2vw, 0.8rem) clamp(2rem, 5vw, 2.5rem);
  border-radius: 40px;
  font-weight: 600;
  font-size: clamp(0.9rem, 3vw, 1rem);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
  margin-top: 1rem;
  border: none;
  cursor: pointer;
  touch-action: manipulation;
}

.about-cta:hover {
  background-color: rgba(5, 5, 73, 0.788);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.about-cta:active {
  transform: translateY(0);
}

/* ===== Skills Section ===== */
.skills-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
  position: relative;
  z-index: 1;
}

.skills-title {
  font-size: clamp(2rem, 6vw, 2.5rem);
  font-weight: 600;
  color: #1a1e24;
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

.skill-card {
  background: white;
  padding: clamp(1.5rem, 4vw, 2rem) clamp(1rem, 3vw, 1.5rem);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.skill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.skill-icon {
  font-size: clamp(2.5rem, 6vw, 3rem);
  margin-bottom: 1rem;
  line-height: 1;
}

.skill-card h3 {
  font-size: clamp(1.1rem, 3.5vw, 1.3rem);
  margin: 0 0 0.75rem;
  color: #1a1e24;
  font-weight: 600;
}

.skill-card p {
  color: #5b6876;
  line-height: 1.6;
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  margin: 0;
  max-width: 300px;
  /* prevents overly long lines */
}

/* ===== Experience Timeline ===== */
.experience-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
  position: relative;
  z-index: 1;
}

.experience-title {
  font-size: clamp(2rem, 6vw, 2.5rem);
  font-weight: 600;
  color: #1a1e24;
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 2rem);
}

.timeline-item {
  display: flex;
  gap: clamp(1rem, 3vw, 2rem);
  background: white;
  padding: clamp(1.2rem, 3vw, 1.5rem) clamp(1.2rem, 3vw, 2rem);
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s;
}

.timeline-item:hover {
  transform: translateX(5px);
}

.timeline-left {
  min-width: 120px;
}

.timeline-year {
  font-weight: 700;
  color: #4a90e2;
  background: rgba(35, 79, 129, 0.082);
  padding: 0.3rem 1rem;
  border-radius: 10px;
  display: inline-block;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  white-space: nowrap;
}

.timeline-right h3 {
  margin: 0 0 0.5rem;
  font-size: clamp(1rem, 3vw, 1.2rem);
  color: #1a1e24;
  font-weight: 600;
}

.timeline-right p {
  margin: 0;
  color: #5b6876;
  line-height: 1.6;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
}

/* ===== Responsive Breakpoints ===== */

/* Tablets and below (≤ 900px) */
@media (max-width: 900px) {
  .about-container {
    margin-top:
      4rem;
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .about-divider {
    margin-left: auto;
    margin-right: auto;
  }

  .about-stats {
    justify-content: center;
  }

  .timeline-item {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .timeline-left {
    min-width: auto;
  }

  .timeline-year {
    white-space: normal;
  }
}

/* Small tablets and large phones (≤ 600px) */
@media (max-width: 600px) {
  .skills-grid {
    grid-template-columns: 1fr;
    /* stack cards */
    gap: 1.2rem;
  }

  .skill-card {
    padding: 1.5rem;
  }

  .skill-card p {
    max-width: 100%;
    /* allow full width */
  }

  .timeline-item {
    padding: 1.2rem;
  }

  .about-stats {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .stat-item {
    align-items: center;
  }
}

/* Very small phones (≤ 400px) */
@media (max-width: 400px) {
  .about-name {
    font-size: 1.8rem;
  }

  .about-title {
    font-size: 1rem;
  }

  .about-text {
    font-size: 0.9rem;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .about-cta {
    padding: 0.6rem 1.5rem;
    font-size: 0.85rem;
  }

  .skill-card h3 {
    font-size: 1rem;
  }

  .skill-card p {
    font-size: 0.8rem;
  }

  .timeline-right h3 {
    font-size: 0.95rem;
  }

  .timeline-right p {
    font-size: 0.85rem;
  }
}

/* Landscape orientation on mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-container {
    padding: 2rem 1rem;
  }

  .about-stats {
    flex-direction: row;
    justify-content: center;
  }
}

/* High-resolution screens (optional) */
@media (min-width: 1440px) {

  .about-container,
  .skills-section,
  .experience-section {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }
}

/* Touch-friendly improvements */
button,
.about-cta,
.skill-card {
  -webkit-tap-highlight-color: transparent;
}

/* Ensure no horizontal overflow */
body {
  overflow-x: hidden;
}

img,
video {
  max-width: 100%;
  height: auto;
}








/* Badge image styling */
.badge-img {
  width: 220px;          /* adjust to your liking */
  height: auto;
  margin-top: 0.75rem;
  margin-right: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.badge-img:hover {
  transform: scale(1.05);
}

/* If you have multiple badges, a container can group them */
.badges-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.badge-note {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.5rem;
}
</file>

<file path="src/styles/blog.css">
/* Hero.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Mulish', sans-serif;
}

.hero {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #ffffff;
  animation: fadeInUp 0.8s ease forwards;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  width: 100%;
}

/* Left column */
.left-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 4rem;
  background-color: whitesmoke;
  transition: filter 0.3s ease;
}

.left-column.blur {
  filter: blur(4px);
}

.hero-name {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #1a1e24;
}

.hero-button {
  background: #1a1e24;
  color: white;
  border: none;
  padding: 0.8rem 2.5rem;
  border-radius: 40px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.hero-button:hover {
  background-color: saddlebrown;
  transform: translateY(-2px);
}

/* Right column */
.right-column {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  transition: filter 0.3s ease;
}

.right-column.blur {
  filter: blur(4px);
}

.image-circle {
  width: 500px;
  height: 500px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
  border: 4px solid white;
}

/* Adjust initial image scale and add smooth transition */
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: bottom; /* you can change to 'top', 'bottom', etc. */
  transform: scale(1.001);   /* slightly zoomed out – adjust as needed */
  transition: transform 0.3s ease;
}

/* Hover zoom effect on the whole circle */
.image-circle:hover .profile-image {
  transform: scale(1.01); /* zooms in more on hover – adjust value */
}

/* Optional: add a subtle cursor change */
.image-circle {
  cursor: pointer;
}


/* Wrapper for the circle and rectangles */
.image-wrapper {
  position: relative;
  display: inline-block; /* shrinks to fit the circle */
}

/* Base style for both rectangles */
.rect {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 8px 16px;
  border-radius: 9px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1e24;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.5);
}








/* Top-right rectangle */
.rect-top-right {
  top: 90px;
  right: -10px; /* sticks out a bit */
}

/* Bottom-left rectangle */
.rect-bottom-left {
  bottom: 20px;
  left: 40px; /* sticks out a bit */
}

/* Adjust rectangles on smaller screens */
@media (max-width: 768px) {
  .rect {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  .rect-top-right {
    top: 10px;
    right: -10px;
  }
  .rect-bottom-left {
    bottom: 10px;
    left: -10px;
  }
}

/* Optional: on very small screens, bring rectangles inside */
@media (max-width: 480px) {
  .rect-top-right {
    right: 10px;
  }
  .rect-bottom-left {
    left: 10px;
  }
}



/* Right column – content arranged horizontally */
.right-column {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(245, 245, 245, 0.137);
  transition: filter 0.3s ease;
}

.right-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem; /* space between image and icons */
}

/* Image wrapper remains as before */
.image-wrapper {
  position: relative;
  display: inline-block;
}

/* Vertical stack of icon circles */
.icon-circles-vertical {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
}

/* Individual icon circle (same style, maybe smaller) */
.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  border: 1px solid black;
  padding: 7px;
}

.icon-circle:hover {
  transform: scale(1.1);
  border: 2px solid saddlebrown;

}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .right-content {
    gap: 1rem;
  }
  .icon-circle {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .right-content {
    flex-direction: column; /* stack on mobile */
    gap: 1.5rem;
  }
  .icon-circles-vertical {
    flex-direction: row; /* horizontal on mobile */
    gap: 1rem;
  }
  .icon-circle {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .icon-circle {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}






/* Artistic name container */
.hero-name-art {
  width: 90%;
  margin-bottom: 1.5rem;
}

/* Grid container for the name letters */
.name-grid {
  display: grid;
  grid-template-columns: repeat(5, auto) 1fr; /* 5 columns for letters + 1 for R */
  grid-template-rows: auto auto;
  align-items: center;
  justify-items: start;
  column-gap: 0.2rem;
  row-gap: 0;
}











/* Tablet and below (max-width: 768px) – stacked layout */
@media (max-width: 768px) {
  .hero {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .hero-grid {
    grid-template-columns: 1fr;      /* stack vertically */
    grid-template-rows: auto auto;    /* two rows: left then right */
    gap: 2rem;                        /* space between rows */
  }

  .left-column {
    align-items: center;              /* center text and button */
    text-align: center;
    padding: 2rem 1rem 1rem 1rem;
  }

  .hero-name {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .hero-button {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }

  .right-column {
    padding: 0 1rem 2rem 1rem;
    justify-content: center;
  }

  .image-circle {
    width: 450px;                      /* larger image */
    height: 450px;
  }

  .icon-circle {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }

  .rect {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .rect-top-right {
    top: 10px;
    right: -10px;
  }

  .rect-bottom-left {
    bottom: 10px;
    left: -10px;
  }
}

/* Small phones (max-width: 600px) */
@media (max-width: 600px) {
  .hero {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .image-circle {
    width: 420px;
    height: 420px;
  }

  .hero-name {
    font-size: 2rem;
  }

  .icon-circle {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
}

/* Very small phones (max-width: 400px) */
@media (max-width: 400px) {
  .hero {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .image-circle {
    width: 260px;
    height: 260px;
  }

  .hero-name {
    font-size: 1.6rem;
  }

  .hero-button {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }

  .icon-circle {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}




.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</file>

<file path="src/styles/navbar.css">
/* Navbar.css - Fully responsive & mobile-first with hardened hamburger */

* {
 font-family: 'Google Sans', sans-serif;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

/* ---------- Navbar Base (Desktop-first, but fluid) ---------- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  /* Higher than overlay */
  transition: box-shadow 0.2s;
}

/* Optional: subtle shadow on scroll, but fixed anyway */

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-text {
  font-size: 1.5rem !important;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: black;
  transition: transform 0.2s ease, filter 0.2s ease;
  display: inline-block;
}

/* Optional hover effect */
.logo-text:hover {
  transform: scale(1.02);
  filter: drop-shadow(0 2px 6px rgba(45, 129, 225, 0.3));
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Reduce motion if user prefers */
@media (prefers-reduced-motion: reduce) {
  .logo-icon {
    animation: none;
  }
}

/* ---------- Desktop Navigation Links ---------- */
.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links li {
  position: relative;
}

/* Separator between items (desktop only) */
.nav-links li:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -1rem;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 1px;
  background-color: #ddd;
}

.nav-links li a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s ease;
  padding: 0.5rem 0;
  /* Larger tap area */
  display: inline-block;
}

.nav-links li a:hover {
  color:  #7C3EFF;
}

.nav-links li a.active {
  background: none !important;
  color:  #7C3EFF;
  font-weight: 600;
}

/* ---------- Hamburger Button (hidden on desktop) ---------- */
.hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #333;
  z-index: 1100;
  /* Above menu and overlay */
  padding: 0.5rem;
  line-height: 1;
  transition: color 0.2s;
  touch-action: manipulation;
  /* Prevents double-tap zoom */
}

.hamburger:hover {
  color:  #7C3EFF;
}

/* ---------- Mobile Styles (≤ 768px) ---------- */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    /* Hidden off-screen */
    width: min(80%, 300px);
    /* Responsive width, capped */
    height: 100vh;
    background-color: #fff;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    transition: right 0.3s ease-in-out;
    z-index: 1050;
    /* Above overlay */
    padding: 2rem 1rem;
    margin: 0;
    list-style: none;
  }

  .nav-links.open {
    right: 0;
  }

  /* Remove separators on mobile */
  .nav-links li:not(:last-child)::after {
    display: none;
  }

  /* Make links bigger for touch */
  .nav-links li a {
    font-size: 1.2rem;
    padding: 0.75rem 1.5rem;
    width: 100%;
    text-align: center;
    border-radius: 4px;
  }

  F .nav-links li a:active {
    background: none !important;
    background-color: #f0f0f0;
  }

  /* Backdrop overlay when menu is open */
  body.menu-open::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 1040;
    transition: opacity 0.3s;
  }

  /* Ensure body doesn't scroll when menu is open */
  body.menu-open {
    overflow: hidden;
  }
}

/* ---------- Small phones (≤ 480px) ---------- */
@media (max-width: 480px) {
  .navbar {
    padding: 0.6rem 1rem;
  }

  .logo-icon {
    font-size: 1.6rem;
  }

  .brand-name {
    font-size: 1.1rem;
  }

  .hamburger {
    font-size: 1.8rem;
  }

  .nav-links {
    width: 85%;
    /* Take a bit more space on very small screens */
    gap: 1.5rem;
  }

  .nav-links li a {
    font-size: 1.1rem;
    padding: 0.6rem 1rem;
  }
}

/* ---------- Landscape orientation on mobile ---------- */
@media (max-width: 768px) and (orientation: landscape) {
  .nav-links {
    justify-content: flex-start;
    padding: 3rem 1rem;
    gap: 1rem;
  }

  .nav-links li a {
    font-size: 1rem;
    padding: 0.4rem 1rem;
  }
}

/* ---------- Ensure active link stands out on mobile ---------- */
.nav-links li a.active {
  background-color: rgba(139, 69, 19, 0.1);
  border-radius: 4px;
}

/* ---------- High-resolution screens (optional tweaks) ---------- */
@media (min-width: 1440px) {
  .navbar {
    padding: 1rem calc((100vw - 1400px) / 2);
    /* Center content on ultra-wide */
  }
}


/* Logo + text wrapper */
.brand-logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.6rem;          /* space between image and text */
}

.brand-logo-img {
  height: 32px;          /* adjust as needed */
  width: auto;
  display: block;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: black;
}

/* ========== SIDEBAR (rotated -90°) ========== */
.sidebar-rotate {
  position: fixed;          /* stay in place while scrolling */
  left: 24px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: center center;
  display: flex;
  flex-direction: row;      /* horizontal inside – becomes vertical after rotation */
  align-items: center;
  gap: 20px;
  white-space: nowrap;
  z-index: 10;
  font-family: 'Google Sans', sans-serif;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: #1a1e24;
}

.sidebar-text {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.sidebar-divider {
  width: 1px;
  height: 60px;            /* adjust height as needed */
  background: #ccc;
}

/* Hide sidebar on smaller screens if it overlaps */
@media (max-width: 768px) {
  .sidebar-rotate {
    display: none;
  }
}
</file>

<file path="src/styles/project.css">
/* ProjectsPage.css - Fully responsive */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



@keyframes moveGradients {
  0% {
    background-position: 0% 50%, 20% 50%, 40% 50%;
  }
  100% {
    background-position: 20% 50%, 40% 50%, 60% 50%;
  }
}

.projects-page {
  width: 100% !important;
  margin: 0 auto;
  padding: clamp(1rem, 5vw, 1rem) clamp(1rem, 5vw, 5rem);
  background-image:
    radial-gradient(circle at 50% 50%, rgba(78, 205, 196, 0.5) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 107, 107, 0.5) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 230, 109, 0.5) 0%, transparent 50%);
  background-color: white;
  background-size: 200% 100%, 200% 100%, 200% 100%;
  background-position: 0% 50%, 20% 50%, 40% 50%;
  background-repeat: no-repeat;
  animation: fadeInUp 1.8s ease forwards, moveGradients 2.2s infinite alternate ease-in-out;
}

/* ---------- Header ---------- */
.projects-header {
  margin-bottom: clamp(2rem, 4vw, 3rem);
  text-align: center;
}

.projects-header h1 {
  font-size: clamp(2rem, 6vw, 2.9rem);
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.projects-header p {
  font-size: clamp(0.95rem, 3vw, 1.125rem);
  color: #4B5563;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

/* ---------- Filter Buttons ---------- */
.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 0.75rem;
  margin-bottom: clamp(2rem, 4vw, 2.5rem);
}

.filter-buttons button {
  padding: 0.5rem 1.25rem;
  margin-bottom: 1%;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, transform 0.1s;
  background-color: #E5E7EB;
  color: #374151;
  white-space: nowrap;
  min-width: 70px;
  touch-action: manipulation;
}

.filter-buttons button:hover {
  background-color: #D1D5DB;
}

.filter-buttons button.active {
  background-color: #111827;
  color: white;
}

.filter-buttons button:active {
  transform: scale(0.96);
}

/* ---------- Projects Grid ---------- */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* ---------- Project Card Image Entrance Animation ---------- */
.project-card {
  overflow: hidden;
}

.project-card .project-image {
  animation: slideUpFromBottom 0.6s ease forwards;
  display: block;
  width: 100%;
  height: auto;
}

/* ---------- Loading & Empty States ---------- */
.loading-message,
.no-projects-message {
  text-align: center;
  color: #6B7280;
  margin-top: 3rem;
  font-size: 1rem;
}

/* ---------- Responsive Breakpoints ---------- */

/* Small devices (landscape phones, 640px and up) */
@media (min-width: 640px) {
  .projects-page {
    margin-top: 4rem !important;
  }

  .projects-header {
    text-align: left;
  }

  .projects-header p {
    margin-left: 0;
    margin-right: 0;
  }

  .filter-buttons {
    justify-content: flex-start;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) {
  .projects-page {
    width: 100% !important;
  }

  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .projects-page {
    margin-top: 4rem !important;
  }
}

/* Extra small devices (phones < 480px) */
@media (max-width: 479px) {
  .projects-page {
    margin-top: 4rem !important;
  }

  .filter-buttons button {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
    min-width: 60px;
  }

  .projects-header h1 {
    margin-bottom: 0.5rem;
  }

  /* Optionally slow down animation on very small screens for performance */
  .projects-page {
    animation-duration: 3s;
  }
}

/* Optional: reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .projects-page,
  .project-card .project-image {
    animation: none;
  }
}
</file>

<file path="src/components/BlogFeed.tsx">
import { useState } from 'react'; // useEffect no longer needed
import { useCachedPosts } from '../utils/useCachedPosts';
import PostCard from './PostCard';
import '../styles/blogFeed.css';

const defaultImageMap: Record<string, string> = {
  React: '/defaults/react.png',
  CSS: '/defaults/css.png',
  News: '/defaults/news.png',
  JavaScript: '/defaults/javascript.png',
  Fun: '/defaults/fun.png',
};
const fallbackDefaultImage = '/defaults/default.png';

const BlogFeed = () => {
  const { posts, loading } = useCachedPosts(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = filter === 'all' ||
      (post.categories && post.categories.some(cat => cat.toUpperCase() === filter.toUpperCase()));

    let matchesSearch = true;
    if (searchTerm.trim() !== '') {
      const stopWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'was', 'what', 'how', 'why', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'these', 'those']);
      const keywords = searchTerm.toLowerCase().split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.has(word));
      if (keywords.length === 0) keywords.push(searchTerm.toLowerCase());
      const textToSearch = `${post.title.toLowerCase()} ${post.excerpt?.toLowerCase() || ''} ${post.categories?.join(' ') || ''}`;
      matchesSearch = keywords.some(keyword => textToSearch.includes(keyword));
    }

    return matchesCategory && matchesSearch;
  });

  if (loading) return <p className="loading-message">Loading posts...</p>;

  return (
    <div className="blog-feed">
      <div className="search-bar-sticky">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-buttons">
            {['all', 'React', 'CSS', 'News', 'JavaScript'].map(cat => (
              <button
                key={cat}
                className={filter === cat ? 'active' : ''}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="posts-feed">
        {filteredPosts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            defaultImageMap={defaultImageMap}
            fallbackDefaultImage={fallbackDefaultImage}
          />
        ))}
      </div>
      {filteredPosts.length === 0 && (
        <p className="no-posts-message">No posts match your criteria.</p>
      )}
    </div>
  );
};

export default BlogFeed;
</file>

<file path="src/pages/Contact.tsx">
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    FaEnvelope, FaPhoneAlt, FaPaperPlane, FaCalendarCheck
} from 'react-icons/fa';
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import '../styles/contact.css';

// Fix for default marker icons in react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        projectType: 'webdev',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [shakeForm, setShakeForm] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formDataObj = new FormData(form);
        const name = (formDataObj.get('name') as string)?.trim() || '';
        const email = (formDataObj.get('email') as string)?.trim() || '';
        const projectType = formDataObj.get('projectType') as string || 'webdev';
        const message = formDataObj.get('message') as string || '';

        if (!name || !email) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
            return;
        }

        setLoading(true);

        try {
            // 👇 Your Formspree endpoint
            const response = await fetch('https://formspree.io/f/mqedrynl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, projectType, message }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                form.reset();
                setFormData({ name: '', email: '', projectType: 'webdev', message: '' });
                setTimeout(() => setSubmitStatus('idle'), 4000);
            } else {
                console.error('Formspree error:', data.error);
                setSubmitStatus('error');
                setTimeout(() => setSubmitStatus('idle'), 4000);
            }
        } catch (error) {
            console.error('Network error:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 4000);
        } finally {
            setLoading(false);
        }
    };

    // Handler to scroll to form + shake
    const handleScheduleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const formCard = document.querySelector('.form-card');
        if (formCard) {
            formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setShakeForm(true);
        setTimeout(() => setShakeForm(false), 500);
    };

    return (
        <div className="contact-page">
            <div className="map-section">
                <MapContainer center={[5.3959, 7.0102]} zoom={15} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[5.3959, 7.0102]}>
                        <Popup>
                            <strong>📍 FUTO – My Base</strong>
                            <br />
                            Federal University of Technology, Owerri
                            <br />
                            <span style={{ fontSize: '0.9rem' }}>Let’s build something amazing.</span>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            <section className="heroc">
                <h1>Let's Build Something Amazing Together</h1>
                <p>Whether it’s a website, app, or UX project, I’m just a message away.</p>
            </section>

            <div className="contact-grid">
                <div className={`form-card ${shakeForm ? 'shake' : ''}`}>


                    <h2 className='cen'> <HiMiniChatBubbleLeftRight /> Drop a Line</h2>
                    <p className="sub">I’ll get back to you within 24h.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                Full name <span className="required-star">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Alex M."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Email <span className="required-star">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="xy...@gmail.com"
                                required
                                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                            />
                        </div>
                        <div className="form-group">
                            <label>Project type</label>
                            <select name="projectType" value={formData.projectType} onChange={handleChange}>
                                <option value="webdev">Web Dev</option>
                                <option value="uiux">UI/UX</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell me about your idea..."
                            />
                        </div>

                        {submitStatus === 'error' && (
                            <div className="form-message error">
                                ⚠️ Something went wrong. Check your internet connection and try again.
                            </div>
                        )}

                        {submitStatus === 'success' && (
                            <div className="form-message success">
                                ✨ Message sent! I’ll get back to you soon.
                            </div>
                        )}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'} <FaPaperPlane />
                        </button>
                    </form>
                </div>

                <div className="image-side">
                    <video
                        src="/video.mp4"
                        className="contact-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
            </div>

            <div className="direct-contact">
                <div className="contact-item">
                    <FaEnvelope />
                    <a href="mailto:victormayowa185@gmail.com">victormayowa185@gmail.com</a>
                </div>
                <div className="contact-item">
                    <FaPhoneAlt />
                    <a href="tel:+2348113270110">+234 811 327 0110</a>
                </div>
            </div>

            <footer className="cta-footer">
                <h2>Got a project? Don’t wait. Let’s make it happen.</h2>
                <a href="#" className="cta-button" onClick={handleScheduleClick}>
                    Schedule a call <FaCalendarCheck />
                </a>
                <p className="footnote">— remote & worldwide —</p>
            </footer>
        </div>
    );
};

export default ContactPage;
</file>

<file path="src/pages/Home.tsx">
import React, { useRef, useState, useEffect } from 'react';
import {
  FaReact,
  FaJsSquare,
  FaCss3Alt,
  FaGitAlt,
} from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import '../styles/home.css';

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePos({ x, y });
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const boxes = [
    { id: 1, icon: <FaReact size={98} />, label: 'React', color: '#61dafb', offset: 0.3 },
    { id: 2, icon: <FaJsSquare size={48} />, label: 'JavaScript', color: '#f7df1e', offset: 0.5 },
    { id: 3, icon: <SiTypescript size={98} />, label: 'TypeScript', color: '#3178c6', offset: 0.4 },
    { id: 4, icon: <FaGitAlt size={28} />, label: '20+ repos', color: '#f34f29', offset: 0.6 },
    { id: 5, icon: <FaCss3Alt size={48} />, label: 'CSS3', color: '#2965f1', offset: 0.2 },
  ];

  return (
    <div ref={heroRef} className="hero-new">
      <div className="homepage-container">
        {/* Sidebar – using writing-mode */}
        <div className="sidebar-rotate">
          <span className="sidebar-text">2026</span>
          <div className="sidebar-divider"></div>
          <span className="sidebar-text">Founder of MAYO X  </span>
        </div>

        {/* Left column – text */}
        <div className="main-content">
          <h1 className="hero-name">
            Code. Design.<br /> Build. Innovate.
          </h1>
          <p className="hero-tagline">
            I'm Victor Mayowa — a Software Developer &amp; Designer.
          </p>
          <p className="hero-bio">
            I specialize in UI/UX Design, Responsive Web Design, and Visual Development.
            I build <b>digital products</b> that are fast, accessible, and beautifully designed —
            from responsive websites to cross-platform desktop apps.
          </p>
          <a href="/contact" className="hero-cta">Connect With Me</a>
        </div>

        {/* Right column – scattered boxes */}
        <div className="hero-right">
          <div className="boxes-container">
            {boxes.map((box) => {
              const translateX = mousePos.x * 30 * box.offset;
              const translateY = mousePos.y * 30 * box.offset;

              return (
                <div
                  key={box.id}
                  className="scatter-box"
                  style={{
                    transform: `translate(${translateX}px, ${translateY}px)`,
                    borderColor: box.color,
                  }}
                >
                  <div className="box-icon" style={{ color: box.color }}>
                    {box.icon}
                  </div>
                  <span className="box-label">{box.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
</file>

<file path="src/styles/home.css">
* {
  font-family: 'Google Sans', sans-serif;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}


/* ========== HERO SECTION - NO SCROLL, ALIGNED TO TOP ========== */
.hero-new {
  height: 100vh;
  width: 100%;
  background: white;
  display: flex;
  align-items: flex-start;
  padding: 5rem 1rem 1rem 1rem;
  /* ← set left padding to 0 */
  position: relative;
  overflow: visible;
  /* ← allow sidebar to go outside without being cut */
}

/* ========== FLEX CONTAINER – sidebar and content side by side ========== */
.homepage-container {
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  width: 100%;
  max-width: 1400px;
  overflow-x: visible;
  margin: 0 auto;
  height: 100%;
}

.sidebar-rotate {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  height: fit-content;
  padding-top: 0;
  margin-top: 0;
  position: relative;
  top: 1rem;
  margin-left: -1rem;
  margin-right: 3rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: #1a1e24;
}

.sidebar-text {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  white-space: nowrap;
}

.sidebar-divider {
  width: 1px;
  height: 300px;
  /* ← unchanged – stays at 180px as you requested */
  background: #ccc;
  flex-shrink: 0;
}

/* ========== MAIN CONTENT (text) ========== */
.main-content {
  flex: 1;
  min-width: 280px;
  max-width: 600px;
  padding-top: 0;
  height: fit-content;
}

.hero-name {
  font-size: 4rem !important;
  font-weight: 500 !important;
  margin-top: 0;
  /* ← removes default h1 margin */
  margin-bottom: 1rem;
  color: black;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.7rem;
  color: #1a1e24;
  font-weight: 300;
  margin-bottom: 0.75rem;
}

.hero-bio {
  font-size: 1rem;
  color: #5b6876;
  line-height: 1.8;
  max-width: 480px;
  margin-bottom: 1.5rem;
}

.hero-cta {
  display: inline-block;
 border: 1px solid black;
  color: black;
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s;
}



/* ========== RIGHT COLUMN (boxes) ========== */
.hero-right {
  flex: 1;
  min-width: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* ========== SCATTERED BOXES ========== */
.boxes-container {
  position: relative;
  width: 100%;
  max-width: 550px;
  aspect-ratio: 1 / 1;
}

.scatter-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #ddd;
  border-radius: 16px;
  padding: 1rem 1.2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease-out, box-shadow 0.3s ease;
  will-change: transform;
  min-width: 90px;
  min-height: 90px;
  gap: 0.3rem;
}

.scatter-box:hover {
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  transform: scale(1.05) !important;
}

/* Position each box – scattered randomly */
.scatter-box:nth-child(1) {
  top: 5%;
  left: 5%;
}

.scatter-box:nth-child(2) {
  top: 10%;
  right: 8%;
}

.scatter-box:nth-child(3) {
  bottom: 25%;
  left: 0%;
}

.scatter-box:nth-child(4) {
  bottom: 5%;
  right: 15%;
}

.scatter-box:nth-child(5) {
  top: 50%;
  left: 35%;
  transform: translateY(-50%);
}

.box-icon {
  font-size: 2rem;
  line-height: 1;
}

.box-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1a1e24;
  text-align: center;
  margin-top: 0.15rem;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 1024px) {
  .hero-new {
    padding: 5rem 2rem 2rem;
  }

  .homepage-container {
    gap: 2rem;
  }
}

@media (max-width: 900px) {
  .hero-new {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
    padding: 1.5rem;
    align-items: center;
    /* ← center content on mobile */
  }

  .homepage-container {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    align-items: center;
    height: auto;
    overflow: visible;
  }

  .main-content {
    text-align: center;
    max-width: 100%;
    height: auto;
  }

  .hero-bio {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-right {
    width: 100%;
    min-height: 350px;
    height: auto;
  }

  .boxes-container {
    aspect-ratio: 4 / 3;
    max-width: 100%;
  }

  .scatter-box {
    min-width: 70px;
    min-height: 70px;
    padding: 0.7rem 0.9rem;
  }

  .scatter-box:nth-child(1) {
    top: 2%;
    left: 5%;
  }

  .scatter-box:nth-child(2) {
    top: 5%;
    right: 5%;
  }

  .scatter-box:nth-child(3) {
    bottom: 20%;
    left: 3%;
  }

  .scatter-box:nth-child(4) {
    bottom: 2%;
    right: 8%;
  }

  .scatter-box:nth-child(5) {
    top: 45%;
    left: 30%;
  }

  .box-icon {
    font-size: 1.5rem;
  }

  .box-label {
    font-size: 0.65rem;
  }

  /* Hide sidebar on mobile */
  .sidebar-rotate {
    display: none;
  }
}

@media (max-width: 600px) {
  .hero-new {
    padding: 1rem;
  }

  .hero-right {
    min-height: 300px;
  }

  .scatter-box {
    min-width: 60px;
    min-height: 60px;
    padding: 0.5rem 0.7rem;
    border-radius: 12px;
  }

  .box-icon {
    font-size: 1.2rem;
  }

  .box-label {
    font-size: 0.55rem;
  }
}

@media (max-width: 400px) {
  .hero-name {
    font-size: 2rem;
  }

  .hero-tagline {
    font-size: 1rem;
  }

  .hero-bio {
    font-size: 0.9rem;
  }

  .hero-cta {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }

  .hero-right {
    min-height: 250px;
  }

  .scatter-box {
    min-width: 50px;
    min-height: 50px;
    padding: 0.4rem 0.5rem;
    border-radius: 10px;
  }

  .box-icon {
    font-size: 1rem;
  }

  .box-label {
    font-size: 0.5rem;
  }
}
</file>

<file path="src/App.tsx">
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { TourProvider } from './components/TourContext';
import TourOverlay from './components/TourOverlay';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Project from './pages/Project';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';

// Layout component that wraps every page
function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Navbar />
      <Outlet />
      {!isHome && <Footer />}
      <TourOverlay />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Project /> },
      { path: 'contact', element: <Contact /> },
      { path: 'blog', element: <Blog /> },
      { path: 'post/:slug', element: <PostDetail /> },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <TourProvider>
        <Helmet>
          <title>Victor Mayowa – Web Developer & Designer</title>
          <meta name="description" content="Portfolio and blog of Victor Mayowa, a creative web developer sharing coding news, tutorials, and resources." />
          <meta property="og:title" content="Victor Mayowa" />
          <meta property="og:description" content="Portfolio and blog of Victor Mayowa, a creative web developer." />
          <meta property="og:image" content="https://yourdomain.com/default-og-image.png" />
          <meta property="og:url" content="https://yourdomain.com" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        <RouterProvider router={router} />
      </TourProvider>
    </HelmetProvider>
  );
}

export default App;
</file>

<file path="package.json">
{
  "name": "portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emailjs/browser": "^4.4.1",
    "@portabletext/react": "^6.2.0",
    "@sanity/block-content-to-react": "^3.0.0",
    "@sanity/client": "^7.17.0",
    "@sanity/image-url": "^2.0.3",
    "@sanity/vision": "^3.89.0",
    "@splinetool/react-spline": "^4.1.0",
    "@splinetool/runtime": "^1.12.97",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "gsap": "^3.15.0",
    "leaflet": "^1.9.4",
    "meilisearch": "^0.55.0",
    "nodemailer": "^8.0.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-helmet-async": "^3.0.0",
    "react-icons": "^5.5.0",
    "react-leaflet": "^5.0.0",
    "react-router-dom": "^7.13.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/leaflet": "^1.9.21",
    "@types/node": "^24.12.0",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.24",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.2.1",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1",
    "vite-plugin-pwa": "^1.2.0"
  }
}
</file>

</files>
