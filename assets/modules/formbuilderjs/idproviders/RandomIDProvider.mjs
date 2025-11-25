import { IDProvider } from "./IDProvider.mjs";

export class RandomIDProvider extends IDProvider {
    static new() {
        return Math.random().toString(36).substring(2, 12);
    }
}