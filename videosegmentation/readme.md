# Video Segmentation

Requires pySceneDetect: https://pyscenedetect.readthedocs.io/en/latest/download/

    pip install scenedetect[opencv]




## Automatic Video Segmentation

### Example model used:

```
class Session(models.Model):

    # Relationships
    moderator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # Fields
    tan = models.CharField(max_length=30)
    name = models.CharField(max_length=50)
    video = models.FileField(upload_to="upload/files/")
    segmented = models.BooleanField(default=False)

```


### Installing automatic segmentation in models.py:


    # Import custom video segementation script
    from . import autosegment
    
    """ 
    We are using signals becuase we need to wait for the file to be saved on the server
    https://docs.djangoproject.com/en/3.2/topics/signals/
    """
    from django.db.models.signals import post_save
    from django.dispatch import receiver
    
    # Segment video after the creation of a new session
    @receiver(post_save, sender=Session)
    def segment_video(sender, instance, created, *args, **kwargs):
    
        # Segment only newly created sessions
        if created:
            time_stamps = autosegment.find_scenes(instance.video.path, instance.name)
    
    	# Add new Shots to database. These could also be saved in the Session model.
            for t in time_stamps:
                s = Shot(session_id=instance, title='No title', time=t)
                s.save()
    
    	"""
    	Set segmented to True. Field may be useful if we decide to run the segmentation
    	in the background. Currently we must wait for video segmentation to be completed.
    	"""
    	instance.segmented = True
            instance.save()
            
### Example
	
    autosegment.find_scenes('MyVideo.mp4', 'Session26')

#### output:
		[12.4, 17.7, 45.6, 77.9]
		
Images saved on server:
/Sesion26/12.4.jpg
/Sesion26/17.7.jpg
/Sesion26/45.6.jpg
/Sesion26/77.9.jpg



## Image Extraction

### Install image extractor:

    from . import imageextractor

### Extract images from video:

    """
    video_path: path to video file
    session_id: name/id for session
    timestamps: a list of time stamps [12.4, 14.7, 67.5]
    """
    imageextractor.extract(video_path, session_id, timestamps)


### Example

    imageextractor.extract('myVideo.mp4', 'Session27', [12.5, 45.7, 88.9])

#### output:
Images saved on server:
/Sesion27/12.5.jpg
/Sesion27/45.7.jpg
/Sesion27/88.9.jpg