import os
import json

# Standard PySceneDetect imports:
import scenedetect
from scenedetect.video_manager import VideoManager
from scenedetect.scene_manager import SceneManager
# For caching detection metrics and saving/loading to a stats file
from scenedetect.stats_manager import StatsManager
# For content-aware scene detection:
from scenedetect.detectors.content_detector import ContentDetector


# Input: path to video file, a session id and a list of time stamps
def extract(video_path, session_id, timestamps):
    """ extracts single frames per scene from video and saves them at relative path media/screenshots/<session_id>/<nnnnn>.jpg

        :returns: list of timestamps marking the beginning of scenes
        :rtype: List[Float]
        :param video_path: path where videos files are located
        :type video_path: String
        :param session_id: session id from model
        :type session_id: Int
        :param timestamps: list of timestamps marking the beginning of scenes
        :type timestamps: List[Float]
    """

    video_manager = VideoManager([video_path])
    stats_manager = StatsManager()

    # Construct our SceneManager and pass it our StatsManager.
    scene_manager = SceneManager(stats_manager)

    # Add ContentDetector algorithm (each detector's constructor
    # takes detector options, e.g. threshold).
    scene_manager.add_detector(ContentDetector(threshold=90))

    try:

        # Start video_manager.
        video_manager.start()

        # Empty scene list
        scene_list = []

        # Generate scene list from timestamps
        for t in timestamps:
            ftc = (scenedetect.FrameTimecode(timecode=t + .1, fps=video_manager.get_framerate()),
                   scenedetect.FrameTimecode(timecode=t + .2, fps=video_manager.get_framerate()))
            scene_list.append(ftc)

        # Generate images for scenes and save on server
        scenedetect.scene_manager.save_images(scene_list, video_manager, image_name_template='$SCENE_NUMBER',
                                              output_dir='media/screenshots/' + str(session_id))

        # Rename images to required format
        data = []
        for i, scene in enumerate(scene_list):
            time_secs = scenedetect.FrameTimecode(timecode=scene[0].get_timecode(),
                                                  fps=video_manager.get_framerate()).get_seconds()
            # Rename file and replace if exists
            os.replace('media/screenshots/' + str(session_id) + '/' + str(i + 1).zfill(3) + '.jpg', 'media/screenshots/'
                       + str(session_id) + '/' + str(timestamps[i]) + '.jpg')

            # returns the actual times stamps used by pySceneDetect. May slightly deviate.
            data.append(round(time_secs, 1))

        # Other formats are possible
        json_string = json.dumps(data)
        print(json_string)

    finally:
        video_manager.release()

    return data
