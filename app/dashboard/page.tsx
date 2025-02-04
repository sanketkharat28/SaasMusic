"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown, ThumbsUp, ThumbsDown, Play, Share2 } from "lucide-react"
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios"
import { Appbar } from '../components/Appbar'
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { YT_REGEX } from '../lib/utils'
import StreamView from '../components/StreamView'

interface Video {
  "id": string,
  "type" : string,
  "url" : string,
  "extractedId" : string,
  "title": string,
  "smallImg" : string,
  "bigImg" : string,
  "active" : boolean,
  "userId" : string,
  "upvotes": number,
  "hasUpvoted" : boolean
}

const REFRESH_INTERVAL_MS = 10 * 1000;

const creatorId = "d2260998-0b1f-4e73-b2c4-69e9e3592258"

export default function Component() {
    <StreamView creatorId={creatorId} />
}
