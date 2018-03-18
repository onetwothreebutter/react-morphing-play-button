import React from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import YouTubePlayer from 'youtube-player';

class MorphingPlayButton extends React.Component {



    componentDidMount() {
        //cache these DOM elements
        this.pbContainer = document.getElementById('play-button-container');
        this.playTriangleSvg = document.getElementById('play-triangle-svg');
        this.youtubeVideo = document.getElementById('youtube-video');
        this.playTriangle = document.getElementById('play-triangle');

        //set up the animejs timeline
        //(timeline is reversed to make click handler simpler)
        this.playButtonTimeline = anime.timeline({
            autoplay: false,
            direction: 'reverse',
            begin: this.playOrHidePauseVideo.bind(this),
            complete: this.showOrNoOpVideo.bind(this)
        });

        //add the morph and move to the animejs timeline
        this.playButtonTimeline
            .add({
                targets: '#play-triangle',
                points: '0,20 0,80 100,80 100,20',
                easing: 'linear',
                offset: 0,
                duration: 500
            })
            .add({
                targets: '#play-triangle-svg',
                width: [this.playTriangleSvg.getBoundingClientRect().width, window.innerWidth],
                height: [this.playTriangleSvg.getBoundingClientRect().height, window.innerHeight],
                translateX: -1 * this.pbContainer.getBoundingClientRect().left,
                translateY: -1 * this.pbContainer.getBoundingClientRect().top,
                easing: 'easeInOutSine',
                offset: 0,
                duration: 500
            })
            .add({
                targets: '#button-circle-svg',
                scale: this.getMinimumScaleForButtonCircle(),
                opacity: .8,
                offset: 0,
                duration: 600
            });

        //youtube player
        this.youtubePlayer = YouTubePlayer('youtube-video');
    }


    morphButton() {

        this.playButtonTimeline.reverse();
        this.playButtonTimeline.play();
    }


    playOrHidePauseVideo() {

        if(!this.playButtonTimeline.reversed) {
            this.youtubePlayer.playVideo();
        } else {
            this.youtubePlayer.pauseVideo();
            this.hideVideo();
        }
        //manually setting this here so the 'begin' callback will fire next time
        this.playButtonTimeline.began = false;
    }


    showOrNoOpVideo() {

        if(!this.playButtonTimeline.reversed) {
            this.showVideo();
        }
        //manually setting this here so the 'complete' callback will fire next time
        this.playButtonTimeline.completed = false;
    }


    showVideo() {

        this.moveVideo();
        anime({
            targets: this.youtubeVideo,
            opacity: 1,
            duration: 300
        });

        this.youtubeVideo.style.pointerEvents = 'auto';
    }


    hideVideo() {

        anime({
            targets: this.youtubeVideo,
            opacity: 0,
            duration: 0
        });

        this.youtubeVideo.style.pointerEvents = 'none';
    }


    moveVideo() {

        let pbcBoundingBox= this.pbContainer.getBoundingClientRect();
        let playTriangleBoundingBox = this.playTriangle.getBoundingClientRect();
        anime({
            targets: this.youtubeVideo,
            translateX: playTriangleBoundingBox.left - pbcBoundingBox.left,
            translateY: playTriangleBoundingBox.top - pbcBoundingBox.top,
            width: playTriangleBoundingBox.width,
            height: playTriangleBoundingBox.height,
            duration: 0
        });
    }


    getMinimumScaleForButtonCircle() {

        var buttonPosition = {
            x: this.playTriangleSvg.getBoundingClientRect().left + this.playTriangleSvg.getBoundingClientRect().width / 2,
            y: this.playTriangleSvg.getBoundingClientRect().top + this.playTriangleSvg.getBoundingClientRect().height / 2
        };

        var farthestCorner = {
            x: buttonPosition.x > window.innerWidth / 2 ? 0 : window.innerWidth,
            y: buttonPosition.y > window.innerHeight / 2 ? 0 : window.innerHeight
        };

        var a = Math.abs(buttonPosition.x - farthestCorner.x);
        var b = Math.abs(buttonPosition.y - farthestCorner.y);
        var hypotenuse = Math.sqrt(a * a + b * b);

        return hypotenuse / (this.playTriangleSvg.getBoundingClientRect().width / 2);

    }


    render() {

        var playButtonContainerStyles = {
            position: "relative",
            width: "100px",
            height: "100px"
        };
    // &:hover
    //     cursor: pointer

        var svgStyles = {
            position: "absolute",
            top: 0,
            left: 0
        };

        var playTriangleStyles = {
            fill: "black"
        };

        var buttonCircleStyles = {
            fill: '#DDDDDD',
            stroke: '#010101',
            strokeWidth: '0px'
        };

        var youtubeStyles = {
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
            pointerEvents: "none"
        };

        // &.-visible
        // pointer-events: auto

        var buttonTextStyles = {
            paddingTop: "110px",
            textAlign: "center",
            fontFamily: "Arial"
        };



        return (
            <div id="play-button-container" onClick={(e) => this.morphButton()} style={playButtonContainerStyles}>

                <svg id="button-circle-svg"  style={svgStyles} viewBox="0 0 100 100">
                    <circle id="button-circle" style={buttonCircleStyles}
                            className="st0" cx="50" cy="50" r="50"/>
                </svg>

                <svg id="play-triangle-svg" style={svgStyles} viewBox="0 0 100 100">
                    <polygon id="play-triangle" style={playTriangleStyles} points="37,28.2 37,51.95 37,74.1 76.8,51.1"/>
                </svg>

                <iframe id="youtube-video" style={youtubeStyles} width="560" height="315" src={"https://www.youtube.com/embed/" + this.props.youtubeId + "?enablejsapi=1"} frameBorder="0" gesture="media" allow="encrypted-media" allowFullScreen></iframe>
                <div className="button-text" style={buttonTextStyles}>
                    {this.props.buttonText}
                </div>
            </div>
        );
    }
}


MorphingPlayButton.propTypes = {
    buttonText: PropTypes.string,
    youtubeId: PropTypes.string,
};


MorphingPlayButton.defaultProps = {
    buttonText: "Watch Video"
};


export default MorphingPlayButton;
