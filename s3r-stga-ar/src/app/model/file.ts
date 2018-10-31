import {Injectable} from "@angular/core";

@Injectable()
export class File {

    isRightMimeType(resulttype: string): boolean {
        return ((resulttype === "application/pdf") || (resulttype === "image/jpeg") || (resulttype === "image/tiff"));
    }

    evaluateFileSize(fileSize: number) {
        if ((fileSize / 1000000) > 1.0) {
            return (fileSize / 1000000).toFixed(1) + " MB";
        } else if ((fileSize / 1000) > 1.0) {

            return (fileSize / 1000).toFixed(0) + " KB";
        } else {
            return fileSize + " B";
        }
    }
}