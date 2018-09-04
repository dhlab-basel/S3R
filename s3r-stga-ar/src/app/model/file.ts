import {Injectable} from "@angular/core";

@Injectable()
export class File {

    evaluateMimeType(resulttype: string) {
        switch (resulttype) {
            case "application/pdf": {
                return "./assets/files/pdf.png";
            }
            case "image/jpeg": {
                return "./assets/files/jpg.png";
            }
            case "image/tiff": {
                return "./assets/files/tiff.png";
            }
            default: {
                return "./assets/files/png.png";
            }
        }
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