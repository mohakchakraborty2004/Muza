"use client"
import YouTubePlayer from '@/components/player';
import { useParams } from 'next/navigation';

export default function SpacePage() {
    const { spaceId } = useParams() // Get spaceId from the URL

    return (
        <div>
            <h1>Welcome to Space {spaceId}</h1>
            <YouTubePlayer spaceId={spaceId} ></YouTubePlayer>
        </div>
    );
}