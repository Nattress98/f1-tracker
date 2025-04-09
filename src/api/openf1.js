import axios from 'axios';

export const GetMeetings = async (year) => {
    console.log("Fetching meetings for year:", year);
    const response = await axios.get(`https://api.openf1.org/v1/meetings?year=${year}`);

    return response.data;
}