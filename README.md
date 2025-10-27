# Common Ground

A digital experience that helps people find connection through shared perspectives of America's National Parks.

## About

**Common Ground** is built using the [National Parks Service (NPS) Webcams API](https://www.nps.gov/subjects/developer/api-documentation.htm#/webcams/getWebcams) and Next.js, deployed on Vercel. The project explores how digital encounters can remind people of their shared humanity and help them connect meaningfully, both online and off.

### Project Goals

This project addresses the following goals for creating meaningful digital connections:

- **Sparking Conversation & Reflection**: Users can discover new National Parks webcam views and share anonymous reflections about their experience
- **Facilitating Dialogue**: An anonymous comment system allows people to connect over shared locations and perspectives
- **Inspiring Participation**: Users can mark locations they've visited ("I've been here"), creating a sense of community and shared experience
- **Encouraging IRL Connections**: By showcasing real National Parks locations with visit counters, the project encourages real-world exploration
- **Sharing Perspectives**: Multiple users can view, reflect on, and discuss the same webcam views, finding common ground in the shared experience

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Deployment**: Vercel
- **API**: National Parks Service Webcams API
- **Styling**: Tailwind CSS

---

## Getting Started

### Prerequisites

- Node.js 20+ (required for Next.js 16)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your NPS API key:

```env
NPS_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## API Reference

This project uses the [National Parks Service (NPS) Developer API](https://www.nps.gov/subjects/developer/api-documentation.htm#/webcams/getWebcams) for webcam data.

## Deployment

The easiest way to deploy this Next.js app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
