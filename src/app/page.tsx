'use client';

import { useState, useEffect } from 'react';
import type { Webcam } from '@/lib/npsApi';

export default function Home() {
  const [webcam, setWebcam] = useState<Webcam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomWebcam = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/webcam');
      if (!response.ok) {
        throw new Error('Failed to fetch webcam');
      }
      const data = await response.json();
      setWebcam(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomWebcam();
  }, []);

  const handleRefresh = () => {
    fetchRandomWebcam();
  };

  if (loading && !webcam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-blue-50 to-indigo-100 dark:from-zinc-900 dark:via-blue-900 dark:to-indigo-950">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600 mx-auto"></div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Discovering a view...</p>
        </div>
      </div>
    );
  }

  if (error && !webcam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-blue-50 to-indigo-100 dark:from-zinc-900 dark:via-blue-900 dark:to-indigo-950">
        <div className="text-center max-w-md px-6">
          <p className="mb-4 text-lg text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={handleRefresh}
            className="rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50 to-indigo-100 dark:from-zinc-900 dark:via-blue-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Common Ground
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Connecting through shared perspectives
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? 'Loading...' : 'Discover Another View'}
          </button>
        </div>

        {/* Webcam Card */}
        {webcam && (
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-800">
              {/* Header Section */}
              <div className="border-b border-zinc-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:border-zinc-700 dark:from-blue-900 dark:to-indigo-900">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {webcam.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {webcam.isStreaming && (
                      <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                        Live
                      </span>
                    )}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        webcam.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {webcam.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Webcam Images */}
              {webcam.images && webcam.images.length > 0 && (
                <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-6 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="grid gap-4 md:grid-cols-2">
                    {webcam.images.map((image, index) => {
                      // Clean up URL - remove any doubling or @ symbol
                      const cleanUrl = image.url
                        .replace(/^@/, '') // Remove @ at start
                        .replace(/https:\/\/www\.nps\.govhttps:\/\/www\.nps\.gov/, 'https://www.nps.gov'); // Fix doubled domain
                      
                      return (
                        <div key={index} className="overflow-hidden rounded-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cleanUrl}
                            alt={image.altText || image.title || webcam.title}
                            className="h-full w-full object-cover"
                          />
                          {image.title && (
                            <p className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">
                              {image.title}
                            </p>
                          )}
                          {image.caption && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {image.caption}
                            </p>
                          )}
                          {image.credit && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                Credit: {image.credit}
                              </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="px-6 py-6">
                {/* Description */}
                {webcam.description && (
                  <div
                    className="mb-6 text-zinc-700 dark:text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: webcam.description }}
                  />
                )}

                {/* Related Parks */}
                {webcam.relatedParks && webcam.relatedParks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Location
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {webcam.relatedParks.map((park, index) => (
                        <a
                          key={index}
                          href={park.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-blue-100 px-4 py-2 text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                        >
                          <div className="font-semibold">{park.fullName}</div>
                          <div className="text-sm">{park.designation}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {webcam.tags && webcam.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {webcam.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Webcam Link */}
                <div className="mb-6 flex justify-center">
                  <a
                    href={webcam.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    View Webcam
                  </a>
                </div>

                {/* Coordinates */}
                {(webcam.latitude && webcam.longitude) && (
                  <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                    📍 {webcam.latitude.toFixed(4)}, {webcam.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* Share Message */}
            <div className="mt-6 text-center text-zinc-600 dark:text-zinc-400">
              <p className="text-sm">
                Take a moment to observe, reflect, and find common ground with others viewing this same scene.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
