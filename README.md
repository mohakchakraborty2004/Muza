# Muza

Muza is a collaborative music streaming platform where users can create spaces, invite people to join, and stream music together. The admin curates a queue of songs, and members can vote to determine the next song to be played.

## Tech Stack
- **Frontend**: Next.js
- **Backend**: WebSockets
- **Database & Caching**: Redis (Pub/Sub)

## Features
- Users can create spaces and invite others.
- Admins manage the song queue.
- Members vote on which song should play next.
- Real-time updates using WebSockets.

## Upcoming Features
- **Queue System Improvements**: More robust queue management.
- **Batch Writing to Database**: Optimize database interactions.
- **Rate Limiting**: Prevent spamming and excessive requests.

## Known Issues
- Some bugs and glitches need fixing.
- Janky user experience in certain scenarios.
- Performance optimizations required.

## Setup & Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd muza
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

#System Design (2 Parts) 

## Ranking system design

![alt text](public/MuzaSyst.png)

## Muza Space design

![alt text](public/MuzaSpace.png)


## Contribution
Contributions are welcome! If you find a bug or have suggestions, feel free to open an issue or submit a pull request.

## License
MIT License
