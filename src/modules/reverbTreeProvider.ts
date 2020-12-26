/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/**
 * ************************************
 *
 * @module  reverbTreeProvider.ts
 * @author  Amir Marcel, Christopher Johnson, Corey Van Splinter, Sean Arseneault
 * @date 12/8/2020
 * @description Defines ReverbTreeProvider class which renders tree view
 *
 * ************************************
 */

/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';
import * as path from 'path';

let masterDataObject: MasterDataObject | undefined;

// Create a Reverb Tree Provider class that extends vscode Tree Data Provider class
export default class ReverbTreeProvider
    implements vscode.TreeDataProvider<RouteItem | PathItem | RootItem> {
    tree: any;

    // Construct a new ReverbDependenciesProvider, pass workspaceRoot up to TreeDataProvider constructor
    constructor(private workspaceRoot: string, workspaceObj: MasterDataObject | undefined) {
        masterDataObject = workspaceObj;
    }

    // Returns the UI representation (TreeItem) of the element that gets displayed in the view.
    getTreeItem(element: RouteItem | PathItem | RootItem): vscode.TreeItem {
        return element;
    }

    // Returns the children for the given element or root (if no element is passed).
    getChildren(element?: RouteItem | PathItem | RootItem) {
        // Throw an error if no workspace is open
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No path in empty workspace');
            return Promise.resolve([]);
        }
        // Throw an error if there is no route data to display
        if (masterDataObject === undefined) {
            vscode.window.showInformationMessage('No route data exists');
            return Promise.resolve([]);
        }
        // If an element was passed in, create elements for its children
        if (element?.contextValue === 'pathItem') {
            return Promise.resolve(this.getRoutes(element.uri));
        }
        if (element?.contextValue === 'rootItem') {
            return Promise.resolve(this.getPaths());
        }

        // If no element was passed in, create elements for the entire workspace
        return Promise.resolve([
            new RootItem(
                `${vscode.workspace.workspaceFolders![0].name}/`,
                this.workspaceRoot,
                vscode.TreeItemCollapsibleState.Expanded,
            ),
        ]);
    }

    private getRoutes(label: string): Array<RouteItem> | undefined {
        if (masterDataObject === undefined) return;
        const output: RouteItem[] | undefined = [];

        for (const item in masterDataObject.urls) {
            if (masterDataObject.urls[item].path === label) {
                for (const method in masterDataObject.urls[item]) {
                    if (
                        ['get', 'put', 'post', 'delete'].includes(method) &&
                        masterDataObject.urls[item][method].method !== undefined
                    ) {
                        const name = `${masterDataObject.urls[item].url.slice(7)}`;
                        const uri = masterDataObject.urls[item].path;
                        const { url } = masterDataObject.urls[item];
                        const { range } = masterDataObject.urls[item][method];
                        output.push(
                            new RouteItem(
                                name,
                                uri,
                                method,
                                url,
                                range,
                                vscode.TreeItemCollapsibleState.None,
                            ),
                        );
                    }
                }
            }
        }

        return output;
    }

    private getPaths(): Array<PathItem> | undefined {
        if (masterDataObject === undefined) return;
        const output: PathItem[] | undefined = [];
        const dirName = vscode.workspace.workspaceFolders![0].name;

        for (const itemPath in masterDataObject.paths) {
            const substr = itemPath.slice(
                Math.max(0, itemPath.indexOf(dirName) + dirName.length + 1),
            );
            output.push(new PathItem(substr, itemPath, vscode.TreeItemCollapsibleState.Collapsed));
        }

        return output;
    }
}

class PathItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly uri: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
        this.tooltip = this.label;
        this.description = '';
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'folder.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'http.svg'),
    };

    contextValue = 'pathItem';
}

class RouteItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly uri: string,
        public readonly method: string,
        public readonly url: string,
        public readonly range: any,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.method}: ${this.url}`;
        this.description = '';
    }

    methodLabeler(x: string) {
        switch (true) {
            case x === 'get':
                return {
                    light: path.join(__filename, '..', '..', 'resources', 'dark', 'GET.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'GET.svg'),
                };
            case x === 'put':
                return {
                    light: path.join(__filename, '..', '..', 'resources', 'dark', 'PUT.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'PUT.svg'),
                };
            case x === 'post':
                return {
                    light: path.join(__filename, '..', '..', 'resources', 'dark', 'POST.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'POST.svg'),
                };
            case x === 'delete':
                return {
                    light: path.join(__filename, '..', '..', 'resources', 'dark', 'DELETE.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'DELETE.svg'),
                };
            default:
                return {
                    light: path.join(__filename, '..', '..', 'resources', 'light', 'folder.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'http.svg'),
                };
        }
    }

    iconPath = this.methodLabeler(this.method);

    contextValue = 'routeItem';
}

class RootItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly uri: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
        this.tooltip = this.label;
        this.description = '';
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'folder.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'folder.svg'),
    };

    contextValue = 'rootItem';
}
