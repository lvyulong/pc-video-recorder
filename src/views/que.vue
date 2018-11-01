<template>
    <div class="page">
        <div class="content">
            <div class="que">
                <h3>
                    1、与别人相比，你有什么特殊的学习方法吗？请举例说明。
                    <el-button class="pull-right" type="primary" @click="record" size="mini">录制视频</el-button>
                </h3>
            </div>
            <div class="que-container mt1rem">
                <textarea name="answer" class="answer"></textarea>
                <div v-if="recorderFile" class="padding font2rem theme">
                    已录视频
                    &nbsp;&nbsp;
                    <i class="fa fa-play" @click="play"></i>
                </div>
            </div>

            <div class="text-center mt1rem">
                <el-button type="primary" @click="submit">提交并下一题</el-button>
            </div>
        </div>

        <div class="video-container drag-init" v-drag v-if="videoShow">
            <div>
                <video :srcObject="videoUri" controls id="videoPlay" muted></video>
            </div>
            <div class="mt1rem text-center">
                <!--<el-button @click="startRecord">开始录制</el-button>-->
                <el-button @click="stopRecord">停止录制</el-button>
            </div>
        </div>

        <div class="re-play" v-if="current_video">

            <div class="re-play-container">
                <video :src="current_video" controls></video>
                <div class="text-center mt1rem">
                    <el-button @click="current_video = null">关闭</el-button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import authApi from 'api/authApi';
    import videoRecorder from 'app/common/myTool/videoRecorder';

    export default {
        name: "Login",
        data() {
            return {
                videoUri: '',
                mediaRecorder: {},
                chunks: [],
                recorderFile:null,
                mediaStream:'',
                videoShow:false,
                current_video:null,
                file:null
            };
        },
        methods: {
            submit() {
                var that = this;
                this.$message("此按钮只是一个摆设，请先关注录制视频功能");

                console.log("录制的视频：",that.file);
            },

            record() {
                var that = this;
                that.videoShow = true;
                this.$confirm("录制视频之前，请确保您的录像设备完好，并且使用的浏览器为chrome、firefox、opera、360极速模式").then(function () {
                    var constraints = {
                        audio: true,
                        video: true
                        // video: {
                        //     mandatory: { // 对视频Track的强制约束条件
                        //         width: {min: 320},
                        //         height: {min: 180}
                        //     },
                        //     optional: [ // 对视频Track的可选约束条件
                        //         {frameRate: 30}
                        //     ]
                        // }
                    };
                    var video = document.getElementById('videoPlay');
                    videoRecorder.getUserMedia(constraints, function (err, stream) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (MediaRecorder) {
                            that.mediaRecorder = new MediaRecorder(stream);
                        } else {
                            console.error("not support MediaRecorder");
                            return;
                        }
                        that.mediaRecorder.blobs = [];
                        that.mediaRecorder.ondataavailable = function (e) {
                            that.mediaRecorder.blobs.push(e.data);
                            that.chunks.push(e.data);
                        };
                        console.log(that.mediaRecorder);
                        that.mediaRecorder.onstop = function (e) {
                            that.recorderFile = new Blob(that.chunks, { 'type' : that.mediaRecorder.mimeType });
                            that.file = new File([that.recorderFile], 'msr-' + (new Date).toISOString().replace(/:|\./g, '-') + '.mp4', {
                                type: 'video/mp4'
                            });
                            that.chunks = [];
                        };
                        video.srcObject = stream;
                        that.mediaStream = stream;
                        video.play();
                        that.startRecord();
                    })
                },function () {
                    that.videoShow = false;
                })
            },
            startRecord(){
                // 开启录制器
                this.mediaRecorder.start();
            },
            stopRecord(){
                this.videoShow = false;
                // 终止录制器
                this.mediaRecorder.stop();
                // 关闭媒体流
                videoRecorder.closeStream(this.mediaStream);
            },
            play(){
                console.log(this.file);
                if (URL){
                    this.current_video = URL.createObjectURL(this.file);
                }
            }
        },
        created: function () {


        }
    };
</script>
<style lang="less" scoped>
    .page {
        background-image: url("~image/bg_ques.jpg");
        background-size: 100% 100%;
        height: 100vh;
    }

    .content {
        width: 800px;
        margin: 0 auto;
    }

    .que {
        padding-top: 8rem;

    }

    .que-container {
        width: 100%;
        min-height: 500px;
        background: #fff;
        border-bottom: 5px solid #22f3fb;
    }

    .answer {
        width: 100%;
        height: 500px;
        border: none;
        resize: none;
        outline: none;
        padding: 1rem;
        font-size: 1.2rem;
    }

    .video-container {
        cursor: move;
        padding: 1rem;
        position: fixed;
        background: #fff;
        box-shadow: gray 0 0 5px;
        #videoPlay {
            width: 20vw;
            height: 11vw;
        }
    }

    .drag-init {
        bottom: 1rem;
        right: 1rem;
    }
    .re-play{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        text-align: center;
        .re-play-container{
            position: absolute;
            width: 80vw;
            left: 50%;
            top: 50%;
            margin-left: -40vw;
            margin-top: -20vw;
            video{
                width: 100%;
                height: 35vw;
            }
        }
    }
</style>