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

let routeData: WorkspaceObj | undefined;

// Create a Reverb Tree Provider class that extends vscode Tree Data Provider class
export default class ReverbTreeProvider implements vscode.TreeDataProvider<RouteItem | PathItem> {
    tree: any;

    // Construct a new ReverbDependenciesProvider, pass workspaceRoot up to TreeDataProvider constructor
    constructor(private workspaceRoot: string, workspaceObj: WorkspaceObj | undefined) {
        routeData = workspaceObj;
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
        if (routeData === undefined) {
            vscode.window.showInformationMessage('No route data exists');
            return Promise.resolve([]);
        }
        // If an element was passed in, create elements for its children
        if (element) {
            return Promise.resolve(this.getPathsAndRoutes(element.label));
        }
        // If no element was passed in, create elements for the entire workspace
        return Promise.resolve(this.getPathsAndRoutes(''));
    }

    // Given a path generate all routes and methods in an array
    private getPathsAndRoutes(label: string): Array<RouteItem | PathItem> {
        if (label !== '') {
            let data;
            const type = this.getRouteType(label);
            if (type === 'path' || type === 'route') {
                data = this.getRouteData(label);
            }
            switch (type) {
                case 'path':
                    const output = this.generateRouteItems(data);
                    return output;
                case 'route':
                    return [new RouteItem(label, vscode.TreeItemCollapsibleState.None)];
                    break;
                // The label could not be found in the route data
                default:
                    return [];
            }
        }
        // If no label was provided, assume we were passed the workspace object
        const output: Array<RouteItem | PathItem> = [];
        if (routeData) {
            Object.keys(routeData).forEach((path) => {
                // const pathsAndRoutes = this.getPathsAndRoutes(path);
                // output = [...output, ...pathsAndRoutes];
                output.push(new PathItem(path, vscode.TreeItemCollapsibleState.Collapsed));
            });
        }
        return output;
    }

    private getRouteType(label: string): string {
        let output = 'none';
        if (routeData) {
            const elementRoute = label.split(/:\s/, 2)[1];
            Object.entries(routeData).forEach(([path, routeObject]) => {
                if (label === path) {
                    output = 'path';
                }
                Object.keys(routeObject).forEach((route) => {
                    // If the route was found in the list of routes
                    if (elementRoute === route) {
                        output = 'route';
                    }
                });
            });
        }
        return output;
    }

    private getRouteData(
        label: string,
    ): EndPointMethods | { [endpoint: string]: EndPointMethods } | undefined {
        let output;
        if (routeData) {
            const elementRoute = label.split(/:\s/, 2)[1];
            Object.entries(routeData).forEach(([path, routeObject]) => {
                if (label === path) {
                    output = routeObject;
                }
                Object.entries(routeObject).forEach(([route, methodObject]) => {
                    // If the route was found in the list of routes
                    if (elementRoute === route) {
                        output = methodObject;
                    }
                });
            });
        }
        return output;
    }

    // Generate RouteItem objects for each method/route pair in the provided route data
    private generateRouteItems(
        routeData: EndPointMethods | { [endpoint: string]: EndPointMethods } | undefined,
    ): RouteItem[] {
        const generatedRoutes: RouteItem[] = [];
        if (routeData) {
            // Loop through all routes in the provided route data
            Object.entries(routeData).forEach(([route, methodObject]) => {
                // Loop through each method for each route
                Object.keys(methodObject).forEach((method) => {
                    const label = `${method}: ${route}`;
                    // Create a new RouteItem for the method/route pair
                    generatedRoutes.push(
                        new RouteItem(label, vscode.TreeItemCollapsibleState.None),
                    );
                });
            });
        }
        // Return an array containing all generated RouteItem objects
        return generatedRoutes;
    }
}
// Create a Dependency class that extends vscode.TreeItem
class PathItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        // Call the vscode.TreeItem constructor
        super(label, collapsibleState);
        // Define text that should be displayed when the mouse is hovering over the dependency
        this.tooltip = this.label;
        this.description = '';
    }

    // Defines which icon to display next to each dependency
    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg'),
    };
}

// Create a Dependency class that extends vscode.TreeItem
class RouteItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        // Call the vscode.TreeItem constructor
        super(label, collapsibleState);
        // Define text that should be displayed when the mouse is hovering over the dependency
        this.tooltip = this.label;
        this.description = '';
    }

    // Defines which icon to display next to each dependency
    iconPath = {
        light: path.join(__filename, '..', '.media', 'rr.png'),
        dark: path.join(__filename, '..', '.media', 'rr.png'),
    };

    contextValue = 'routeItem';
}
