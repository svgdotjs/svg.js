declare module "@svgdotjs/svg.js" {

    function SVG(): Svg;
    function SVG(id: string): Svg;
    function SVG(domElement: HTMLElement): Svg;

    let ns: string;
    let xmlns: string;
    let xlink: string;
    let svgjs: string;

    let did: number;
    function eid(name: string): string;
    function get(id: string): Element;

    function create(name: string): any;
    function extend(parent: Object, obj: Object): void;
    function invent(config: Object): any;
    function adopt(node: HTMLElement): Element;
    function prepare(element: HTMLElement): void;
    let utils: {
        map(array: any[], block: Function): any;
        filter(array: any[], block: Function): any;
        radians(d: number): number;
        degrees(r: number): number;
        filterSVGElements: HTMLElement[]
    }
    let defaults: {
        attrs: {
            'fill-opacity': number;
            'stroke-opacity': number;
            'stroke-width': number;
            'stroke-linejoin': string;
            'stroke-linecap': string;
            'fill': string;
            'stroke': string;
            'opacity': number;
            'x': number;
            'y': number;
            'cx': number;
            'cy': number;
            'width': number;
            'height': number;
            'r': number;
            'rx': number;
            'ry': number;
            'offset': number;
            'stop-opacity': number;
            'stop-color': string;
            'font-size': number;
            'font-family': string;
            'text-anchor': string;
        }
    }
    let easing: {
        '-'(pos: number): number;
        '<>'(pos: number): number;
        '>'(pos: number): number;
        '<'(pos: number): number;
    }
    let regex: {
        numberAndUnit: RegExp;
        hex: RegExp;
        rgb: RegExp;
        reference: RegExp;
        transforms: RegExp;
        whitespace: RegExp;
        isHex: RegExp;
        isRgb: RegExp;
        isCss: RegExp;
        isBlank: RegExp;
        isNumber: RegExp;
        isPercent: RegExp;
        isImage: RegExp;
        delimiter: RegExp;
        hyphen: RegExp;
        pathLetters: RegExp;
        isPathLetter: RegExp;
        dots: RegExp;
    }

    interface LinkedHTMLElement extends HTMLElement {
        instance: Element;
    }

    // array.js
    type ArrayAlias = _Array | number[] | string;

    class _Array {
        constructor(array?: ArrayAlias, fallback?: number[]);
        value: number[];
        morph(array: number[]): this;
        settle(): number[];
        at(pos: NumberAlias): _Array;
        toString(): string;
        valueOf(): number[];
        parse(array: ArrayAlias): number[];
        reverse(): this;
        clone(): _Array;
    }

    class Dom {
        constructor(element: string, inherit?: any);
        words(text: string): this;
        element(element: string, inherit?: Object): this;
        addTo(parent: Dom): this;
        putIn(parent: Dom): Dom;
        children(): Element[];
        add(element: Element, i?: number): Element;
        put(element: Element, i?: number): Element;
        has(element: Element): boolean;
        index(element: Element): number;
        get(i: number): Element;
        first(): Element;
        last(): Element;
        each(block: (index: number, children: Element[]) => void, deep?: boolean): this;
        removeElement(element: Element): this;
        clear(): this;
    }

    // boxes.js
    class Box {
        height: number;
        width: number;
        y: number;
        x: number;
        cx: number;
        cy: number;
        w: number;
        h: number;
        x2: number;
        y2: number;
        merge(box: Box): Box;
        transform(m: Matrix): Box
        Box(source: string);
        Box(source: []);
        Box(source: object);
        Box(x: number, y: number, width: number, height: number);
    }

    // clip.js
    class ClipPath extends Container {
        constructor();
        targets: Element[];
        remove(): this;
    }
    interface Container {
        clip(): ClipPath;
    }

    // color.js
    interface ColorLike {
        r: number;
        g: number;
        b: number;
    }

    type ColorAlias = string | ColorLike;

    class Color implements ColorLike {
        r: number;
        g: number;
        b: number;
        constructor();
        constructor(color: ColorAlias);

        toString(): string;
        toHex(): string;
        toRgb(): string;
        brightness(): number;
        morph(color: ColorAlias): Color;
        at(pos: number): Color;
    }

    // container.js
    interface ViewBoxLike {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    class Container extends Element { }

    class Defs extends Container { }

    class Svg extends Container {
        constructor();
        constructor(id: string);
        constructor(domElement: HTMLElement);
        namespace(): this;
        defs(): Defs;
        parent(): HTMLElement;
        spof(): this;
        remove(): this;
        isRoot(): boolean;
    }

    type ParentTypeAlias = string | Svg | G;
    class Element extends Dom {
        node: LinkedHTMLElement;
        type: string;

        addClass(name: string): this;
        after(element: Element): Element;
        animate(duration?: number, ease?: string, delay?: number): Animation;
        animate(info: { ease?: string; duration?: number; delay?: number }): Animation;
        attr(): object;
        attr(name: string, value: any, namespace?: string): this;
        attr(name: string): any;
        attr(obj: Object): this;
        attr(obj: Object[]): Object;
        back(): this;
        backward(): this;
        bbox(): Box;
        before(element: Element): Element;
        center(x: number, y: number): this;
        classes(): string[];
        click(cb: Function): this;
        clipper: ClipPath;
        clipWith(element: Element): this;
        clone(): this;
        css(): Object;
        css(style: Object[]): Object;
        css(style: string, value: any): this;
        css(style: string): any;
        css(styles: Object): this;
        ctm(): Matrix;
        cx(): number;
        cx(x: number): this;
        cy(): number;
        cy(y: number): this;
        data(name: string, value: any, sustain?: boolean): this;
        data(name: string): any;
        dblclick(cb: Function): this;
        defs(): Defs;
        dmove(x: NumberAlias, y: NumberAlias): this;
        dx(x: NumberAlias): this;
        dy(y: NumberAlias): this;
        event(): Event | CustomEvent;
        fill(color: string): this;
        fill(fill: { color?: string; opacity?: number, rule?: string }): this;
        fill(image: Image): this;
        fill(pattern: Element): this;
        fire(event: Event): this;
        fire(event: string, data?: any): this;
        flip(a: string, offset?: number): this;
        flip(offset?: number): this;
        forget(...keys: string[]): this;
        forget(): this;
        forward(): this;
        front(): this;
        hasClass(name: string): boolean;
        height(): number;
        height(height: NumberAlias): this;
        hide(): this;
        hide(): this;
        id(): string;
        id(id: string): this;
        inside(x: number, y: number): boolean;
        is(cls: any): boolean;
        linkTo(url: (link: A) => void): A;
        linkTo(url: string): A;
        masker: Mask;
        maskWith(element: Element): this;
        maskWith(mask: Mask): this;
        matches(selector: string): boolean;
        matrix(a: number, b: number, c: number, d: number, e: number, f: number): this;
        matrix(m: MatrixAlias): this;
        matrixify(): Matrix;
        memory(): Object;
        mousedown(cb: Function): this;
        mousemove(cb: Function): this;
        mouseout(cb: Function): this;
        mouseover(cb: Function): this;
        mouseup(cb: Function): this;
        move(x: NumberAlias, y: NumberAlias): this;
        native(): LinkedHTMLElement;
        next(): Element;
        off(event: string, cb?: Function, context?: Object): this;
        on(event: string, cb: Function, context?: Object): this;
        opacity(): number;
        opacity(o: number): this;
        parent(type?: ParentTypeAlias): Dom | HTMLElement;
        parents(): Dom[];
        point(): Point;
        point(position: { x: number, y: number }): Point;
        point(position: ArrayPoint): Point;
        point(x: number, y: number): Point;
        position(): number;
        prev(): Element;
        rbox(element?: Element): Box;
        reference(type: string): Element;
        remember(name: string, value: any): this;
        remember(name: string): any;
        remember(obj: Object): this;
        remove(): this;
        removeClass(name: string): this;
        replace(element: Element): Element;
        root(): Svg;
        rotate(d: number, cx?: number, cy?: number): this;
        scale(x: number, y?: number, cx?: number, cy?: number): this;
        screenCTM(): Matrix;
        setData(data: object): this;
        show(): this;
        show(): this;
        siblings(): Element[];
        size(width?: NumberAlias, height?: NumberAlias): this;
        skew(x: number, y?: number, cx?: number, cy?: number): this;
        stop(jumpToEnd: boolean, clearQueue: boolean): Animation;
        stroke(color: string): this;
        stroke(stroke: StrokeData): this;
        svg(): string;
        svg(svg: string): this;
        tbox(): Box;
        toggleClass(name: string): this;
        toParent(parent: Dom): this;
        toString(): string;
        toSvg(): this;
        touchcancel(cb: Function): this;
        touchend(cb: Function): this;
        touchleave(cb: Function): this;
        touchmove(cb: Function): this;
        touchstart(cb: Function): this;
        transform(): Transform;
        transform(t: Transform, relative?: boolean): Element;
        translate(x: number, y: number): this;
        unclip(): this;
        unmask(): this;
        untransform(): this;
        visible(): boolean;
        visible(): boolean;
        width(): number;
        width(width: NumberAlias): this;
        writeDataToDom(): this;
        x(): number;
        x(x: NumberAlias): this;
        y(): number;
        y(y: NumberAlias): this;
    }

    // ellipse.js
    interface CircleMethods extends Shape {
        rx(rx: number): this;
        rx(): this;
        ry(ry: number): this;
        ry(): this;
        radius(x: number, y?: number): this;
    }
    class Circle extends Shape implements CircleMethods {
        rx(rx: number): this;
        rx(): this;
        ry(ry: number): this;
        ry(): this;
        radius(x: number, y?: number): this;
    }
    class Ellipse extends Shape implements CircleMethods {
        rx(rx: number): this;
        rx(): this;
        ry(ry: number): this;
        ry(): this;
        radius(x: number, y?: number): this;
    }
    interface Container {
        circle(size?: number): Circle;
        ellipse(width?: number, height?: number): Ellipse;
    }

    // TODO finishs FX
    interface StopProperties {
        color?: ColorAlias;
        offset?: number;
        opacity?: number;
    }

    // gradient.js
    class Stop extends Element {
        update(offset?: number, color?: ColorAlias, opacity?: number): this;
        update(opts: StopProperties): this;
    }
    class Gradient extends Container {
        constructor(type: string);
        at(offset?: number, color?: ColorAlias, opacity?: number): Stop;
        at(opts: StopProperties): Stop;
        update(block?: Function): this;
        url(): string;
        url(...params: any[]): never;
        toString(): string;
        from(x: number, y: number): this;
        to(x: number, y: number): this;
        radius(x: number, y?: number): this;
    }
    interface Container {
        gradient(type: string, block?: (stop: Gradient) => void): Gradient;
    }

    // group.js
    class G extends Container {
        gbox(): Box;
    }
    interface Container { group(): G; }

    // hyperlink.js
    class A extends Container {
        to(url: string): this;
        to(): string;
        target(target: string): this;
        target(): string;
    }
    interface Container {
        link(url: string): A;
    }

    // image.js
    class Image extends Shape {
        load(url?: string): this;
    }
    interface Container {
        image(): Image;
        image(href: string, size?: number): Image;
        image(href: string, width?: number, height?: number): Image;
    }

    // line.js
    interface ArrayPoint extends Array<number> { }
    type PointArrayAlias = ArrayPoint[] | number[] | PointArray | string;

    class Line extends Shape {
        array(): PointArray;
        plot(points: PointArrayAlias): this;
        plot(x1: number, y1: number, x2: number, y2: number): this;
        move(x: number, y: number): this;
        size(width?: number, height?: number): this;
    }
    interface Container {
        line(points: PointArrayAlias): Line;
        line(x1: number, y1: number, x2: number, y2: number): Line;
    }

    // marker.js
    class Marker extends Container {
        ref(x: string | number, y: string | number): this;
        update(block: (marker: Marker) => void): this;
        toString(): string;
    }
    interface Container {
        marker(width?: number, height?: number, block?: (marker: Marker) => void): Marker
    }
    interface Defs {
        marker(width?: number, height?: number, block?: (marker: Marker) => void): Marker
    }
    interface Line {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => void): Marker;
        marker(position: string, marker: Marker): Marker;
    }
    interface Polyline {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => void): Marker;
        marker(position: string, marker: Marker): Marker;
    }
    interface Polygon {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => void): Marker;
        marker(position: string, marker: Marker): Marker;
    }
    interface Path {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => void): Marker;
        marker(position: string, marker: Marker): Marker;
    }

    // mask.js
    class Mask extends Container {
        targets: Element[];
    }
    interface Container { mask(): Mask; }

    // matrix.js
    interface MatrixExtract {
        x: number;
        y: number;
        transformedX: number;
        transformedY: number;
        skewX: number;
        skewY: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
        matrix: Matrix;
    }

    interface MatrixLike {
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
    }

    type MatrixAlias = MatrixLike | number[] | Element | string;

    class Matrix {
        constructor();
        constructor(source: MatrixAlias);
        constructor(a: number, b: number, c: number, d: number, e: number, f: number);
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
        extract(): MatrixExtract;
        clone(): Matrix;
        morph(matrix: Matrix): this;
        at(pos: number): Matrix;
        multiply(matrix: Matrix): Matrix;
        inverse(): Matrix;
        translate(x: number, y: number): Matrix;
        scale(x: number, y?: number, cx?: number, cy?: number): Matrix;
        rotate(r: number, cx?: number, cy?: number): Matrix;
        flip(a: string, offset?: number): Matrix;
        flip(offset?: number): Matrix;
        skew(x: number, y?: number, cx?: number, cy?: number): Matrix;
        skewX(x: number, cx?: number, cy?: number): Matrix;
        skewY(y: number, cx?: number, cy?: number): Matrix;
        around(cx: number, cy: number, matrix: Matrix): Matrix;
        native(): SVGMatrix;
        toString(): string;
    }

    // number.js
    class _Number {
        constructor();
        constructor(value: _Number);
        constructor(value: string);
        constructor(value: number, unit?: any);
        toString(): string;
        toJSON(): Object;
        valueOf(): number;
        plus(number: number): _Number;
        minus(number: number): _Number;
        times(number: number): _Number;
        divide(number: number): _Number;
        to(unit: string): _Number;
        morph(number: any): this;
        at(pos: number): _Number;
    }

    type NumberAlias = _Number | number | string;

    // path.js
    interface PathArrayPoint extends Array<number | string> { }
    type PathArrayAlias = PathArray | (string | number)[] | PathArrayPoint[] | string;

    class Path extends Shape {
        morphArray: PathArray;
        array(): PathArray;
        plot(d: PathArrayAlias): this;
    }
    interface Container {
        path(): Path;
        path(d: PathArrayAlias): Path;
    }

    // pathArray.js
    class PathArray extends _Array {
        constructor();
        constructor(d: PathArrayAlias);
        move(x: number, y: number): this;
        size(width?: number, height?: number): this;
        parse(array: PathArrayAlias): PathArrayPoint[];
        parse(array: ArrayAlias): never;
        bbox(): Box;
    }

    // pattern.js
    class Pattern extends Container {
        url(): string;
        url(...rest: any[]): never;
        update(block: (pattern: Pattern) => void): this;
        toString(): string;
    }
    interface Container {
        pattern(width?: number, height?: number, block?: (pattern: Pattern) => void): Pattern
    }

    // point.js
    class Point {
        constructor();
        constructor(position: ArrayPoint);
        constructor(point: Point);
        constructor(position: { x: number, y: number });
        constructor(x: number, y: number);

        x: number;
        y: number;

        clone(): Point;
        morph(point: Point): this;
        at(pos: number): Point;
        native(): SVGPoint;
        transform(matrix: Matrix): Point;
    }

    // pointArray.js
    class PointArray extends _Array {
        constructor();
        constructor(points: PointArrayAlias);
        toString(): string;
        toLine(): {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        };
        parse(points: PointArrayAlias): ArrayPoint[];
        parse(array: ArrayAlias): never;
        move(x: number, y: number): this;
        size(width?: number, height?: number): this;
        bbox(): Box;
    }

    // poly.js
    interface poly {
        array(): PointArray;
        plot(p: PointArrayAlias): this;
        move(x: number, y: number): this;
        size(width: number, height: number): this;
    }
    class PolyLine extends Shape implements poly {
        array(): PointArray;
        plot(p: PointArrayAlias): this;
        move(x: number, y: number): this;
        size(width: number, height: number): this;
    }
    interface Container {
        polyline(points: PointArrayAlias): PolyLine;
    }
    class Polygon extends Shape implements poly {
        array(): PointArray;
        plot(p: PointArrayAlias): this;
        move(x: number, y: number): this;
        size(width: number, height: number): this;
    }
    interface Container {
        polygon(points: PointArrayAlias): Polygon;
    }

    // rect.js
    class Rect extends Shape {
        radius(x: number, y?: number): this;
    }
    interface Container {
        rect(width?: number, height?: number): Rect;
    }

    // set.js
    class List extends _Array {
        constructor(members?: Element[]);
        each(block: (index: number, members: Element[]) => void): this;
    }
    interface Container { set(members?: Element[]); }

    // shape.js
    class Shape extends Element {
    }


    // sugar.js
    interface StrokeData {
        color?: string;
        width?: number;
        opacity?: number;
        linecap?: string;
        linejoin?: string;
        miterlimit?: number;
        dasharray?: string;
        dashoffset?: number;
    }
    interface Path {
        length(): number;
        pointAt(length: number): { x: number, y: number };
    }
    interface FontData {
        family?: string;
        size?: NumberAlias;
        anchor?: string;
        leading?: NumberAlias;
        weight?: string;
        style?: string
    }

    // text.js
    class Text extends Shape {
        constructor();
        font(font: FontData): this;
        clone(): this;
        text(): string;
        text(text: string): this;
        text(block: (text: Text) => void): this;
        leading(): number;
        leading(leading: NumberAlias): this;
        lines(): List;
        rebuild(enabled: boolean): this;
        build(enabled: boolean): this;
        plain(text: string): this;
        tspan(text: string): Tspan;
        tspan(block: (tspan: Tspan) => void): this;
        clear(): this;
        length(): number;
        path(d: PathArrayAlias): this;
        track(): Element;
        textPath(): Element;
    }

    interface Container {
        text(text: string): Text;
        text(block: (tspan: Tspan) => void): Text;
        plain(text: string): Text;
    }
    class Tspan extends Shape {
        constructor();
        text(): string;
        text(text: string): Tspan;
        text(block: (tspan: Tspan) => void): this;
        dx(x: NumberAlias): this;
        dy(y: NumberAlias): this;
        newLine(): this;
        plain(text: any): this;
        tspan(text: string): Tspan;
        tspan(block: (tspan: Tspan) => void): this;
        clear(): this;
        length(): number;
    }

    // textpath.js
    class TextPath extends Text { }

    interface Transform {
        x?: number;
        y?: number;
        rotation?: number;
        cx?: number;
        cy?: number;
        scaleX?: number;
        scaleY?: number;
        skewX?: number;
        skewY?: number;
        matrix?: Matrix; // 1,0,0,1,0,0
        a?: number; // direct digits of matrix
        b?: number;
        c?: number;
        d?: number;
        e?: number;
        f?: number;
        scale?: number;
    }
    class Transformation {
        constructor(...transform: Transform[]);
        constructor(source: Transform, inversed?: boolean);
        at(pos: number): Matrix;
        undo(transform: Transform): this
    }
    class Translate extends Transformation { constructor() }
    class Rotate extends Transformation { constructor() }
    class Scale extends Transformation { constructor() }
    class Skew extends Transformation { constructor() }

    interface Container {
        ungroup(parent: Dom, depth?: number): this;
        flatten(parent: Dom, depth?: number): this;
    }

    // use.js
    class Use extends Shape {
        element(element: string, file?: string): this;
    }
    interface Container {
        use(element: Element | string, file?: string): Use;
    }

    // viewbox.js
    type ViewBoxAlias = ViewBoxLike | number[] | string | Element;

    class ViewBox {
        constructor(source: ViewBoxAlias);
        constructor(x: number, y: number, width: number, height: number);
        x: number;
        y: number;
        width: number;
        height: number;
        zoom?: number;
        toString(): string;
        morph(source: ViewBoxAlias): ViewBox;
        morph(x: number, y: number, width: number, height: number): ViewBox;
        at(pos: number): ViewBox;
    }
    interface Container {
        viewbox(): ViewBox;
        viewbox(x: number, y: number, width: number, height: number): this;
        viewbox(viewbox: ViewBoxLike): this;
    }

    interface Animation {
        stop(): Animation;
        finish(): Animation;
        pause(): Animation;
        play(): Animation;
        reverse(reversed?: boolean): Animation;

        attr(name: string, value: any, namespace?: string): Animation;
        attr(obj: Object): Animation;
        attr(name: string): any;
        attr(): object;

        viewbox(x: number, y: number, w: number, h: number): Animation;

        move(x: number, y: number, anchor?: boolean): Animation;
        dmove(x: number, y: number): Animation;
        x(x: number, anchor?: boolean): Animation;
        y(y: number, anchor?: boolean): Animation;

        center(x: number, y: number, anchor?: boolean): Animation;
        cx(x: number, anchor?: boolean): Animation;
        cy(y: number, anchor?: boolean): Animation;

        size(w: number, h: number, anchor?: boolean): Animation;
        during(cb: (pos: number) => void): Animation;
        to(value: number): Animation;
        after(cb: () => void): Animation;

        delay(delayMS: number): Animation;

        rotate(degrees: number, cx?: number, cy?: number): Animation;
        skew(skewX: number, skewY?: number, cx?: number, cy?: number): Animation;
        scale(scaleX: number, scaleY?: number, cx?: number, cy?: number): Animation;
        translate(x: number, y: number): Animation;
        transform(t: Transform, relative?: boolean): Animation;

        // TODO style, etc, bbox...
    }
}