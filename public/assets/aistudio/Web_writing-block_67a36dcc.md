# ADDABUZZ LIVE — FREE-FIRST MASTER BUILD PROMPT

## Project Identity

Application: AddaBuzz Live  
Tagline: Connect • Stream • Chat • Enjoy

Build a complete, original social live-streaming platform with:

1. Responsive Web Application
2. Installable Progressive Web App
3. Native Android Application integration
4. Shared Backend and Database

The application must be free for end users.

## 1. Strict Free-Technology Policy

Use only free and open-source technologies wherever possible.

Mandatory technologies:

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Free Tier
- PostgreSQL
- Supabase Authentication
- Supabase Realtime
- Supabase Storage
- Node.js
- LiveKit Open Source Self-hosted Server
- LiveKit WebRTC SDK
- Kotlin
- Jetpack Compose
- Android Studio
- GitHub Free Repository

Restrictions:

- No mandatory paid API.
- No paid streaming subscription.
- No paid authentication provider.
- No paid UI template.
- No paid SDK.
- No mandatory Gemini API.
- No Firebase dependency.
- No paid database.
- No automatic paid deployment.
- No paid service without explicit approval.

Never subscribe to, activate or purchase any service.

Use local development and self-hosted services wherever possible.

Before using an external dependency, verify that it has a usable free or open-source option.

Clearly document all free-tier limitations.

## 2. Shared Backend Architecture

Build one shared backend for Web and Android.

Supabase:
- Authentication
- User profiles
- PostgreSQL database
- User relationships
- Live room records
- Messages
- Notifications
- Wallet ledger
- Gift transactions
- Storage

Node.js server:
- Secure API endpoints
- LiveKit token generation
- Room creation and deletion
- Participant authorization
- Host permissions
- Guest seat management
- Secure financial operations

LiveKit:
- Actual real-time audio.
- Actual real-time video.
- Multi-participant rooms.
- WebRTC media tracks.
- Participant management.
- Reconnection handling.

Never expose database service-role credentials or LiveKit secrets in client applications.

The Android and Web applications must use the same user identities, profiles, room records and permissions.

## 3. Premium UI Design

Create an original premium dark design.

Colors:
- Deep black
- Dark violet
- Purple gradients
- Electric blue
- White typography

Create:
- Original AddaBuzz logo.
- Custom favicon.
- Splash screen.
- Premium dashboard.
- Sidebar navigation.
- Mobile bottom navigation.
- Responsive cards.
- Smooth animations.
- Glassmorphism panels.

## 4. Main Features

Build these modules:

A. Authentication
- Email registration.
- Email login.
- Google OAuth.
- Male/Female selection.
- Username.
- Confirm password.
- Password reset.
- Email verification.

B. User Profiles
- Avatar.
- Cover photo.
- Username.
- Bio.
- Country.
- Followers.
- Following.
- Online status.
- Profile editing.

C. Home
- Featured live rooms.
- Popular streamers.
- Trending rooms.
- New streamers.
- Categories.
- Online friends.
- Recommendations.

D. Live Streaming
- Video Live.
- Audio Live.
- Viewer Mode.
- Start and end Live.
- Camera controls.
- Microphone controls.
- Live duration.
- Viewer count.
- Real-time comments.
- Network quality.

E. Multi-Guest Room
- Maximum 8 guest seats.
- Host control.
- Guest requests.
- Accept and reject.
- Invite participants.
- Mute guests.
- Remove guests.
- Lock seats.
- Real LiveKit participant tracks.

F. Social
- Follow/unfollow.
- Private messages.
- Notifications.
- Blocking.
- Reporting.
- User search.

G. Gifts and Wallet
- Virtual gifts.
- Gift animations.
- Transaction history.
- Wallet ledger.
- Secure balance updates.

Implement wallet functionality using server-side transactions and never allow client-side balance manipulation.

H. Administration
- User management.
- Room management.
- Moderators.
- Reports.
- Suspensions.
- Gift catalog.
- Audit logs.

## 5. Database

Create migrations for:

- profiles
- user_settings
- user_follows
- user_blocks
- live_rooms
- live_participants
- live_seats
- live_join_requests
- live_messages
- room_moderators
- notifications
- conversations
- conversation_members
- private_messages
- gift_catalog
- wallets
- wallet_transactions
- gift_transactions
- reports
- audit_logs

Use UUID primary keys, foreign keys, indexes, timestamps and secure RLS policies.

## 6. Free Infrastructure

Create Docker Compose configuration for local development.

Include:
- LiveKit Server.
- Redis only if required by the chosen deployment configuration.
- Node.js backend.
- Local development configuration.

Keep Supabase as the primary application database.

Use environment variables for secrets.

Provide:
- .env.example
- docker-compose.yml
- livekit.yaml.example
- Database migration scripts
- README.md
- DEVELOPMENT_STATUS.md

Do not include real secrets in committed files.

## 7. Native Android Compatibility

Prepare the backend API and authentication flow for native Android.

Android application must use:
- Kotlin.
- Jetpack Compose.
- Supabase-compatible authentication/API integration.
- LiveKit Android SDK.
- Secure token retrieval from the backend.

Android and Web must share the same backend.

Do not put API secrets inside the APK.

## 8. Development Workflow

Build incrementally.

PHASE 1:
Premium Web UI and responsive application shell.

PHASE 2:
Authentication and profiles.

PHASE 3:
Supabase database and security.

PHASE 4:
LiveKit video and audio.

PHASE 5:
8-seat multi-guest room.

PHASE 6:
Chat, social and notifications.

PHASE 7:
Gifts and wallet.

PHASE 8:
Admin and moderation.

PHASE 9:
PWA and native Android integration.

PHASE 10:
Testing and deployment.

## 9. Strict Quality Rules

- Never use fake streaming.
- Never use fake authentication.
- Never hardcode production user data.
- Never expose private credentials.
- Never leave important controls non-functional.
- Never silently replace a required technology.
- Never delete working project functionality.
- Never claim an unfinished feature is complete.
- Test with multiple real authenticated accounts.
- Test real LiveKit audio and video.
- Test all 8 guest seats.
- Verify database authorization.
- Verify production build.

## 10. First Execution

START WITH PHASE 1 ONLY.

Inspect the existing project.

Build the original AddaBuzz Live responsive Web Application with:

- Logo.
- Home dashboard.
- Navigation.
- Featured Live cards.
- Streamer profiles.
- Categories.
- Recommendations.
- Mobile layout.
- Desktop layout.

Use development preview data only where necessary.

Do not pretend backend or streaming integration is complete.

After Phase 1:
1. Run the build.
2. Fix errors.
3. Verify the interface.
4. Update DEVELOPMENT_STATUS.md.
5. List files created.
6. List completed features.
7. List remaining work.

STOP and wait for the next instruction.

The final objective is a genuinely functional, free-first social streaming platform for Web and Android.