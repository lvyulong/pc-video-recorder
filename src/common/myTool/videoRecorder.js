export default {
    getUserMedia: function (constraints, callback) {

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
            || navigator.msGetUserMedia || window.getUserMedia;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                callback(false, stream);
            })['catch'](function(err) {
                callback(err);
            });
        } else if (navigator.getUserMedia) {
            console.log("navigator.getUserMedia");
            navigator.getUserMedia(constraints, function (stream) {
                callback(false, stream);
            }, function (err) {
                callback(err);
            });
        } else {
            console.log("Not support userMedia");
            callback(new Error('Not support userMedia'));
        }
    },
    closeStream: function (stream) {
        if (typeof stream.stop === 'function') {
            stream.stop();
        }
        else {
            let trackList = [stream.getAudioTracks(), stream.getVideoTracks()];

            for (let i = 0; i < trackList.length; i++) {
                let tracks = trackList[i];
                if (tracks && tracks.length > 0) {
                    for (let j = 0; j < tracks.length; j++) {
                        let track = tracks[j];
                        if (typeof track.stop === 'function') {
                            track.stop();
                        }
                    }
                }
            }
        }
    }
};