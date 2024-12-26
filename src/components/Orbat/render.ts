import * as THREE from "three";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import Font from '@styles/Capture it_Regular.json';
import type { Group, Unit } from "../../types/Orbat";


const mockUnits: Unit[] = [{
    name: "SuperFranky",
},{
    name: "Unit1",
}, {
    name: "Unit2",
}, {
    name: "Unit3",
}, {
    name: "Unit4",
}, {
    name: "Unit5",
}, {
    name: "Unit6",
    }]

const mockGroup2: Group = {
    name: "Group2",
    children: [mockUnits[3], mockUnits[4]],
}

const mockGroup3: Group = {
    name: "Group3",
    children: [mockUnits[5], mockUnits[6]],
}

const mockGroup4: Group = {
    name: "Group4",
    children: [mockUnits[1], mockUnits[3]],
}

const mockGroup1: Group = {
    name: "Group1",
    children: [mockUnits[1], mockUnits[2]],
    childrenGroups: [mockGroup2, mockGroup3, mockGroup4],
}

const mockHQGroup: Group = {
    name: "HQ",
    children: [mockUnits[0]],
    childrenGroups: [mockGroup1],
}


class Render {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private window: Window;
    private div: HTMLElement;
    private orbat: Group;
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;

    private DEPTH: number = 5;
    private XOFFSET: number = 10;
    constructor(window: Window, div: HTMLElement, orbat: Group) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, -10, 40); // Lower the camera to center it to all elements
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, div.clientHeight);
        this.renderer.setClearColor(0x121212, 1);
        this.scene.add(this.camera);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;
        this.controls.target.set(0, -(this.DEPTH * 2.8), 0);
        this.controls.update();
        this.window = window;
        this.div = div;
        this.orbat = orbat;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.div.appendChild(this.renderer.domElement);
        window.addEventListener('click', this.onClick.bind(this), false);
        this.animate();
        this.renderTree(mockHQGroup, this.scene);
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    createTextMesh(text: string,  onClick?: () => void): THREE.Mesh {
        const loader = new FontLoader();
        const font = loader.parse(Font);
        
        const geometry = new TextGeometry(text, {
            font: font,
            size: 1,
            depth: 0.1,
        });
        const material = new THREE.MeshBasicMaterial({ color: 0x8b8c8d });
        const mesh = new THREE.Mesh(geometry, material);
        if (onClick) {
            mesh.userData = { onClick };
        }
        return mesh;
    }

    createArrow(start: THREE.Vector3, end: THREE.Vector3): THREE.ArrowHelper {
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const length = start.distanceTo(end);
        const color = 0xffffff;
        const headLength = 1;
        const headWidth = 0.5;
        return new THREE.ArrowHelper(direction, start, length, color, headLength, headWidth);
    }

    createTree(topGroup: Group, parent: THREE.Object3D, depth: number = 0, xOffset: number = 0) {
        const group = new THREE.Group();
        group.position.set(xOffset, -depth, 0);
        parent.add(group);
        const textMesh = this.createTextMesh(topGroup.name, () => this.showUnits(topGroup,group));
        textMesh.geometry.computeBoundingBox();
        const textWidth = textMesh.geometry.boundingBox!.max.x - textMesh.geometry.boundingBox!.min.x;
        textMesh.position.set(-textWidth / 2, 0, 0); // Center the text
        group.add(textMesh);
        let childXOffset = topGroup.childrenGroups?.length ? -topGroup.childrenGroups.length * this.XOFFSET / 2 + this.XOFFSET / 2 : 0;
        topGroup.childrenGroups?.forEach((childrenGroup) => {
            const childGroup = new THREE.Group();
            childGroup.position.set(childXOffset, -(depth + this.DEPTH), 0);
            group.add(childGroup);

            const arrow = this.createArrow(
                new THREE.Vector3(0, -0.5, 0), // Adjusted start position to be below the text
                new THREE.Vector3(childXOffset, -(depth + this.DEPTH) - (this.DEPTH - 1), 0) // Adjusted end position to be above the child text
            );
            group.add(arrow);

            this.createTree(childrenGroup, childGroup, depth + this.DEPTH, 0);
            childXOffset += this.XOFFSET; // Adjust the xOffset for each child group
        });
    }

    onClick(event: MouseEvent) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        console.log('Intersects:', intersects);
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.onClick) {
                object.userData.onClick();
            }
        }
    }

    showUnits(group: Group, parent: THREE.Object3D) {
        const unitGroup = new THREE.Group();
        unitGroup.position.set(0, -1, 0); // Position the units below the group text
        parent.add(unitGroup);

        let unitYOffset = 0;
        group.children.forEach(unit => {
            const unitTextMesh = this.createTextMesh(unit.name);
            unitTextMesh.position.set(0, unitYOffset, 0);
            unitGroup.add(unitTextMesh);
            unitYOffset -= 1.5; // Adjust the yOffset for each unit text
        });
    }

    renderTree(topGroup: Group, scene: THREE.Scene) {
        this.createTree(topGroup, scene);
    }
}

export const initRender = (window: Window, div: HTMLElement, orbat: Group) => {
  new Render(window, div, orbat);
}