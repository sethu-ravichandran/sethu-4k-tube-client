import React, { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Download, Play, RefreshCw } from 'lucide-react'
import { io } from 'socket.io-client'
import api from '../lib/api'
import { isValidYoutubeUrl } from '../lib/utils'
import StatusMessage from './StatusMessage'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3500'
const socket = io(BACKEND_URL)

const DownloaderCard = () => {
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('best')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [detailedError, setDetailedError] = useState('')
  const [videoFilename, setVideoFilename] = useState(null)
  const [showVideo, setShowVideo] = useState(false)

  const currentUrlRef = useRef('')

  // WebSocket listeners
  useEffect(() => {
    socket.on('download-progress', ({ url: eventUrl, progress }) => {
      if (eventUrl === currentUrlRef.current) {
        setProgress(progress)
      }
    })

    socket.on('download-complete', ({ url: eventUrl, success, filename }) => {
      if (eventUrl === currentUrlRef.current) {
        setStatus(success ? 'success' : 'error')
        setMessage(success ? 'Download complete!' : 'Download failed.')
        setProgress(100)
        if (success && filename) {
          setVideoFilename(filename)
        }
      }
    })

    return () => {
      socket.off('download-progress')
      socket.off('download-complete')
    }
  }, [])

  // Download trigger
  const handleDownload = async () => {
    setMessage('')
    setDetailedError('')
    setProgress(0)
    setVideoFilename(null)
    setShowVideo(false)

    if (!isValidYoutubeUrl(url)) {
      setStatus('error')
      setMessage('Please enter a valid YouTube URL')
      return
    }

    try {
      setStatus('loading')
      setMessage('Starting download process...')
      currentUrlRef.current = url

      const response = await api.post('/download', {
        url,
        quality,
        socketId: socket.id
      })

      setMessage(response.data.message || 'Download started...')
    } catch (error) {
      setStatus('error')
      const errorMsg =
        error.friendlyMessage ||
        error.response?.data?.error ||
        'Download failed. Please try again.'
      setMessage(`Download failed: ${errorMsg.split('.')[0]}`)
      setDetailedError(errorMsg)
      console.error('Download error:', error)
    }
  }

  const handleReset = () => {
    setUrl('')
    setQuality('best')
    setStatus('idle')
    setMessage('')
    setProgress(0)
    setDetailedError('')
    setVideoFilename(null)
    setShowVideo(false)
    currentUrlRef.current = ''
  }

  const handlePlayVideo = () => {
    setShowVideo(true)
  }

  return (
    <div className="shadow-lg border border-gray-200 rounded-lg bg-white">
      <div className="pb-4 p-6">
        <h2 className="text-xl text-center text-gray-800 font-semibold">
          Download YouTube Videos
        </h2>
      </div>

      <div className="space-y-4 px-6 pb-4">
        {/* Input: URL */}
        <div className="space-y-2">
          <label htmlFor="youtube-url" className="text-sm font-medium text-gray-700">
            YouTube URL
          </label>
          <input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={status === 'loading'}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Input: Quality */}
        <div className="space-y-2">
          <label htmlFor="quality" className="text-sm font-medium text-gray-700">
            Video Quality
          </label>
          <select
            id="quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            disabled={status === 'loading'}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          >
            <option value="4k">4K (2160p)</option>
            <option value="1080p">Full HD (1080p)</option>
            <option value="best">Best Available</option>
          </select>
        </div>

        {/* Progress bar */}
        {status === 'loading' && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Status Message */}
        <StatusMessage status={status} message={message} />

        {/* Error Panel */}
        {detailedError && status === 'error' && (
          <div className="mt-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Troubleshooting:</p>
              <p>{detailedError}</p>
              <p className="mt-1 text-xs">
                Make sure the backend server is running and properly configured.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 flex flex-col gap-4">
        {status === 'success' && videoFilename ? (
          <>
            <button
              onClick={handlePlayVideo}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Play Video
            </button>
            <button
              onClick={handleReset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center transition-all duration-300"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Download Another
            </button>
          </>
        ) : (
          <button
            onClick={handleDownload}
            disabled={status === 'loading' || !url.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-2 px-4 rounded-md flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              'Processing...'
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download Video
              </>
            )}
          </button>
        )}
      </div>

      {/* Video Preview */}
      {showVideo && videoFilename && (
        <div className="px-6 pb-6">
          <video
            controls
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            className="w-full mt-4 rounded-md border"
            src={`${BACKEND_URL}/downloads/${videoFilename}`}
          />
        </div>
      )}
    </div>
  )
}

export default DownloaderCard
