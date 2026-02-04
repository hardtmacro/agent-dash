import { NextResponse } from 'next/server';

// Google Drive file IDs for public data
const STATUS_FILE_ID = '1mrNgXSIgUxscX5p8uhvQCaxD8nBqtHRa';
const ACTIVITY_FILE_ID = '13vf0IDeQJIh6Ae9sz_j2dXWiKvKZdu1B';

async function fetchDriveFile(fileId: string) {
  // Use Google Drive direct download URL
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error fetching Drive file ${fileId}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // Fetch both files in parallel
    const [statusData, activityData] = await Promise.all([
      fetchDriveFile(STATUS_FILE_ID),
      fetchDriveFile(ACTIVITY_FILE_ID)
    ]);

    // Merge the data
    const data = {
      agents: statusData?.agents ? Object.values(statusData.agents) : [],
      tasks: statusData?.tasks || [],
      activities: activityData?.activities || [],
      lastUpdate: statusData?.lastUpdate || new Date().toISOString()
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching agent status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent status', agents: [], tasks: [], activities: [] },
      { status: 500 }
    );
  }
}
