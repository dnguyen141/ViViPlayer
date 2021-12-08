
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


def find_scenes(video_path, session_id):

    video_manager = VideoManager([video_path])
    stats_manager = StatsManager()
    # Construct our SceneManager and pass it our StatsManager.
    scene_manager = SceneManager(stats_manager)

    # Add ContentDetector algorithm (each detector's constructor
    # takes detector options, e.g. threshold).
    scene_manager.add_detector(ContentDetector(threshold=30))

    try:
        # Set downscale factor to improve processing speed.
        video_manager.set_downscale_factor()

        # Start video_manager.
        video_manager.start()

        # Perform scene detection on video_manager.
        scene_manager.detect_scenes(frame_source=video_manager)

        # Obtain list of detected scenes.
        scene_list = scene_manager.get_scene_list()

        # Generate images
        scenedetect.scene_manager.save_images(scene_list, video_manager, image_name_template='$SCENE_NUMBER',
                                              output_dir=session_id)

        # Rename images to required format
        data = []
        for i, scene in enumerate(scene_list):
            time_secs = scenedetect.FrameTimecode(timecode=scene[0].get_timecode(),
                                                  fps=video_manager.get_framerate()).get_seconds()

            # Rename file and replace if exists
            os.replace(session_id + '/' + str(i + 1).zfill(3) + '.jpg', session_id + '/' + str(round(time_secs, 1)) + '.jpg')

            data.append(round(time_secs, 1))

        # We can return the data in various ways
        json_string = json.dumps(data)
        print(json_string)

    finally:
        video_manager.release()

    return data


