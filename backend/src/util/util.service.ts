export class UtilService {
    public getTimeElapsedInSeconds(startTime: Date, endTime: Date): number {
        return Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    }
}
