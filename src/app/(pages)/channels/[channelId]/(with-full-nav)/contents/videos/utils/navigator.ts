class Node {
    token: string;
    prevPage: Node | null;

    constructor(data: string) {
        this.token = data;
        this.prevPage = null;
    }
}

export class PageNavigator {
    currentPage: Node | null = null;

    constructor(token: string) {
        this.currentPage = new Node(token);
    }

    next(token: string) {
        if (this.currentPage) {
            const node = new Node(token);
            node.prevPage = this.currentPage;
            this.currentPage = node;
        }
    }

    prev() {
        if (this.currentPage) {
            this.currentPage = this.currentPage.prevPage;
        }
    }
}
