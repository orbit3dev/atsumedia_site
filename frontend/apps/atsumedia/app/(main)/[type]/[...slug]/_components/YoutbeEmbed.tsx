'use client';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const checkYouTubeVideo = async (videoId: string) => {
	if (!videoId) return false;

	const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

	try {
		const response = await fetch(url);

		if (response.status === 403) {
			console.log(`動画 ${videoId} は非公開または制限されています。`);
			return 'private'; // Mark video as private but still embed it
		}

		return response.ok; // Returns true if the video exists, false otherwise
	} catch (error) {
		return false;
	}
};

const YoutubeEmbed: React.FC<{ embedId: string; className?: string; mutedAutoPlay?: boolean; onStatusChange?: (status: boolean | 'private') => void }> = ({
	embedId,
	className = '',
	mutedAutoPlay = true,
	onStatusChange,
}) => {
	const [videoStatus, setVideoStatus] = useState<boolean | 'private' | null>(null);

	useEffect(() => {
		if (embedId) {
			checkYouTubeVideo(embedId).then((status) => {
				setVideoStatus(status);
				onStatusChange?.(status); // Ensure this runs
			});
		} else {
			setVideoStatus(false);
			onStatusChange?.(false);
		}
	}, [embedId, onStatusChange]);

	if (videoStatus === null) {
		return null;
	}

	if (!videoStatus) {
		return null; // Hide everything if video is not valid
	}

	return (
		<div className={`video-responsive w-full relative ${className}`}>
			<iframe
				id="player"
				className="w-full h-auto aspect-video"
				src={`https://www.youtube.com/embed/${embedId}?${mutedAutoPlay ? 'autoplay=1&mute=1' : ''}`}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				title="Embedded YouTube Video"
			/>
		</div>
	);
};

YoutubeEmbed.propTypes = {
	embedId: PropTypes.string.isRequired,
	className: PropTypes.string,
	mutedAutoPlay: PropTypes.bool,
	onStatusChange: PropTypes.func,
};

export default YoutubeEmbed;
