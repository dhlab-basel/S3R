import {Injectable} from "@angular/core";

@Injectable()
export class File {
    private validMimeTypes: [string, string] [] =
        [
            ["application/pdf", "PDF"],
            ["image/jpeg", "JPEG"],
            ["image/tiff", "TIFF"]
        ];

    mimeTypeToSimpleForm(mimeType: string): string | null {
        let simpleForm = null;
        for (let i of this.validMimeTypes) {
            if (mimeType === i[0]) {
                simpleForm = i[1];
                break;
            }
        }
        return simpleForm;
    }

    simpleFormTomimeType(simpleForm: string): string | null {
        let mimeType = null;
        for (let i of this.validMimeTypes) {
            if (simpleForm === i[1]) {
                mimeType = i[0];
                break;
            }
        }
        return mimeType;
    }

    getAllSimpleForms(): string[] {
        let simpleForms = [];
        for (let i of this.validMimeTypes) {
            simpleForms.push(i[1]);
        }
        return simpleForms;
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