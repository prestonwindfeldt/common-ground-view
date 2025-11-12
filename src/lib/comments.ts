import connectDB from './mongodb';
import { Webcam, type Comment, type WebcamData } from './models/Webcam';

export type { Comment, WebcamData };

export async function getWebcamData(webcamId: string): Promise<WebcamData> {
  try {
    await connectDB();
    
    const webcam = await Webcam.findOne({ webcamId });
    
    if (!webcam) {
      return { visitCount: 0, comments: [] };
    }
    
    return {
      visitCount: webcam.visitCount,
      comments: webcam.comments,
    };
  } catch (error) {
    console.error('Error reading webcam data:', error);
    return { visitCount: 0, comments: [] };
  }
}

export async function addComment(webcamId: string, commentText: string): Promise<void> {
  try {
    await connectDB();
    
    const webcam = await Webcam.findOne({ webcamId });
    
    if (webcam) {
      webcam.comments.push({
        text: commentText,
        timestamp: new Date().toISOString(),
      });
      await webcam.save();
    } else {
      // Create new webcam document
      await Webcam.create({
        webcamId,
        visitCount: 0,
        comments: [{
          text: commentText,
          timestamp: new Date().toISOString(),
        }],
      });
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
}

export async function incrementVisitCount(webcamId: string): Promise<void> {
  try {
    await connectDB();
    
    const webcam = await Webcam.findOne({ webcamId });
    
    if (webcam) {
      webcam.visitCount += 1;
      await webcam.save();
    } else {
      // Create new webcam document
      await Webcam.create({
        webcamId,
        visitCount: 1,
        comments: [],
      });
    }
  } catch (error) {
    console.error('Error incrementing visit count:', error);
  }
}

