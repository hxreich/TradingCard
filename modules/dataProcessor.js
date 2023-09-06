const dataProcessorFunctions = {
    processTopTracks(topTracksData) {
        if (!topTracksData || !topTracksData.toptracks || !topTracksData.toptracks.track) {
            // Handle missing data
            return [];
        }
    
        // Extract and format track data
        const processedTracks = topTracksData.toptracks.track.map((trackInfo) => {
            const trackName = trackInfo.name || 'Unknown Track';
            const artistName = trackInfo.artist.name || 'Unknown Artist';
    
            return {
                trackName,
                artistName,
            };
        });
        console.log(processedTracks);
    
        return processedTracks;
    },
};

export default dataProcessorFunctions;