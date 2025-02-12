
interface ISong {
    id: string; // this can be fetched from api as well
    name: string; // youtube API fetch
    upvotes: number;
    timestamp: number;
}


export class Song implements ISong {
    constructor(
        public id: string,
        public name: string,
        public upvotes: number,
        public timestamp: number
    ) {}

    toString(): string {
        return `${this.name} (${this.upvotes} upvotes)`;
    }
}

export class SongQueue {
    private songs: Song[];

    constructor() {
        this.songs = [];
    }

    
    //  Binary search to find the correct position for the target song
    //   @param targetSong - The song that needs to be positioned
    //   @param endIndex - The upper bound index for search
    //   @returns The position where the song should be inserted
     
    private findPosition(targetSong: Song, endIndex: number): number {
        let left = 0;
        let right = endIndex - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            if (this.songs[mid].upvotes < targetSong.upvotes) {
                right = mid - 1;
            } else if (this.songs[mid].upvotes > targetSong.upvotes) {
                left = mid + 1;
            } else {
                // If upvotes are equal, use timestamp as tiebreaker
                if (this.songs[mid].timestamp > targetSong.timestamp) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }

        return left;
    }

    
    //   Add a new song to the queue
    
    addSong(song: Song): void {
        const position = this.findPosition(song, this.songs.length);
        this.songs.splice(position, 0, song);
    }

    /**
     * Update queue when a song gets an upvote
     * @param songId - ID of the song that received an upvote
     * @returns boolean indicating if the upvote was successful
     */
    upvoteSong(songId: string): boolean {
        const songIndex = this.songs.findIndex(song => song.id === songId);
        
        if (songIndex === -1) return false;

        // Increment upvotes
        this.songs[songIndex].upvotes++;
        const targetSong = this.songs[songIndex];

        // Find new position
        const newPosition = this.findPosition(targetSong, songIndex);

        // Move song to new position
        if (newPosition !== songIndex) {
            this.songs.splice(songIndex, 1); // Remove from old position
            this.songs.splice(newPosition, 0, targetSong); // Insert at new position
        }

        return true;
    }

    
     //Get current queue state
    
    getQueue(): Song[] {
        return [...this.songs];
    }

    getNextSong(): Song | null {
        return this.songs.length > 0 ? this.songs[0] : null;
    }
}