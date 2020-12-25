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
export default class ReverbTreeProvider implements vscode.TreeDataProvider<RouteItem | PathItem> {
    tree: any;

    // Construct a new ReverbDependenciesProvider, pass workspaceRoot up to TreeDataProvider constructor
    constructor(private workspaceRoot: string, workspaceObj: MasterDataObject | undefined) {
        masterDataObject = workspaceObj;
    }

    // Returns the UI representation (TreeItem) of the element that gets displayed in the view.
    getTreeItem(element: RouteItem | PathItem): vscode.TreeItem {
        return element;
    }

    // Returns the children for the given element or root (if no element is passed).
    getChildren(element?: RouteItem | PathItem) {
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
            return Promise.resolve(this.getRoutes(element.label));
        }

        // If no element was passed in, create elements for the entire workspace
        return Promise.resolve(this.getPaths());
    }

    private getRoutes(label: string): Array<RouteItem> | undefined {
        if (masterDataObject === undefined) return;
        const output: RouteItem[] | undefined = [];

        function methodLabeler(x: string) {
            switch (true) {
                case x === 'get':
                    return 'GET      :: ';
                case x === 'put':
                    return 'PUT      :: ';
                case x === 'post':
                    return 'POST    :: ';
                case x === 'delete':
                    return 'DELETE :: ';
                default:
                    return 'GET      :: ';
            }
        }

        for (const item in masterDataObject.urls) {
            if (masterDataObject.urls[item].path === label) {
                for (const method in masterDataObject.urls[item]) {
                    if (
                        ['get', 'put', 'post', 'delete'].includes(method) &&
                        masterDataObject.urls[item][method].method !== undefined
                    ) {
                        const name = `${methodLabeler(method)}${masterDataObject.urls[
                            item
                        ].url.slice(7)}`;
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

        for (const itemPath in masterDataObject.paths) {
            output.push(new PathItem(itemPath, vscode.TreeItemCollapsibleState.Collapsed));
        }

        return output;
    }
}

class PathItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
        // Define text that should be displayed when the mouse is hovering over the dependency
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
        // Define text that should be displayed when the mouse is hovering over the dependency
        this.tooltip = this.uri;
        this.description = '';
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'boolean.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'arrow.svg'),
    };

    contextValue = 'routeItem';
}
