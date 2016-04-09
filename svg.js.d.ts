// todo add SVG.FX
declare namespace svgjs {
    export interface Library {
        (selector: string): Doc;
        (domElement: HTMLElement): Doc;
        ns: string;
        xmlns: string;
        xlink: string;
        svgjs: string;
        supported: boolean;

        did: number;
        eid(name: string): string;

        create(name: string): any;
        extend(parent: Object, obj: Object): void;
        invent(config: Object): any;
        atopt(node: HTMLElement): Element;
        prepare(element: HTMLElement): void;
    }
    interface LinkedHTMLElement extends HTMLElement {
        instance: Element;
    }

    // arrange.js
    interface Element {
        front(): this;
        back(): this;
        forward(): this;
        backward(): this;

        siblings(): Element[];
        position(): number;
        next(): Element;
        previous(): Element;
        before(element: Element): Element;
        after(element: Element): Element;
    }

    // array.js
    interface _Array {
        (array: any[], fallback?: any): _Array;
        value: any[];
        morph(array: any[]): this;
        settle(): number;
        at(pos: number): any;
        toString(): string;
        valueOf(): any[];
        // parse(array:any[]):any[];
        split(string: string): any[];
        reverse(): this;
    }
    interface Library { Array(array: any[], fallback?: any): void }

    // attr.js
    interface Element {
        attr(name: string): any;
        attr(obj: Object): this;
        attr(name: string, value: any, namespace?: string): this;
    }

    // bare.js
    export interface Bare extends Element {
        (element: string, inherit?: any): Bare;
        words(text: any): this;
    }
    interface Parent {
        element(element: string, inherit?: any): Bare;
        symbol(): Bare;
    }
    interface Library { Bare(element: string, inherit?: any): void; }

    // boxes.js
    export interface BBox {
        (element?: Element)
        height: number;
        width: number;
        y: number;
        x: number;
        cx: number;
        cy: number;
        merge(bbox: BBox): BBox;
    }
    export interface RBox extends BBox { }
    export interface TBox extends BBox { }
    interface Container {
        bbox(): BBox;
        rbox(): RBox;
        tbox(): TBox;
    }
    interface Library {
        BBox(element?: Element): void;
        RBox(element?: Element): void;
        TBox(element?: Element): void;
    }

    // clip.js
    export interface ClipPath extends Container { }
    interface Container {
        clip(): ClipPath;
    }
    interface Element {
        clipWith(element: Element): this;
        clipper: ClipPath;
        unclip(): this;
    }
    interface Library { ClipPath(): void; }

    // color.js
    export interface Color {
        (color: string): Color;
        (color: Color): Color;
        r: number;
        g: number;
        b: number;

        toString(): string;
        toHex(): string;
        toRgb(): string;
        brightness(): number;
        morph(color: Color): Color;
        morph(color: string): Color;
        at(pos: number): Color;
    }
    interface Library {
        Color(color: string): void;
        Color(color: Color): void;
    }

    // container.js
    export interface Container extends Parent {
        viewbox(): ViewBox;
        viewbox(v): this;
    }
    interface Library { Container(): void }

    // data.js
    interface Element {
        data(name: string): any;
        data(name: string, value: any, sustain?: boolean): this;
    }

    // default.js
    interface Library {
        defaults: {
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
    }

    // defs.js
    export interface Defs extends Container { }
    interface Library { Defs(): void }

    // doc.js
    export interface Doc extends Container {
        (selector: string): Doc;
        (domElement: HTMLElement): Doc;
        namespace(): this;
        defs(): Defs;
        parent(): HTMLElement;
        spof(spof): this;
        remove(): this;
    }
    interface Library {
        Doc(selector: string): void;
        Doc(domElement: HTMLElement): void;
    }

    // element.js
    export interface Element {
        node: LinkedHTMLElement;
        type: string;

        x(x: number): this;
        x(): number;
        y(y: number): this;
        y(): number;
        cx(x: number, anchor?: boolean): this;
        cx(): number;
        cy(y: number, anchor?: boolean): this;
        cy(): number;
        move(x: number, y: number): this;
        center(x: number, y: number): this;

        width(width: number): this;
        width(): number;
        height(height: number): this;
        height(): number;
        size(w: number, h: number, anchor?: boolean): this;

        clone(): Element;
        remove(): this;
        replace(element: Element): Element;

        addTo(parent: Parent): this;
        putIn(parent: Parent): Parent;

        id(): string;
        id(id: string): this;

        inside(x: number, y: number): boolean;

        show(): this;
        hide(): this;
        visible(): boolean;

        toString(): string;

        classes(): string[];
        hasClass(name: string): boolean;
        addClass(name: string): this;
        removeClass(name: string): this;
        toggleClass(name: string): this;

        reference(type: string): Element;

        parents(): Parent[];

        matches(selector: string): boolean;
        native(): LinkedHTMLElement;

        svg(svg: string): this;
        is(cls: any): boolean;
    }
    interface Library { Element(): void; }

    // ellipse.js
    interface CircleMethods extends Shape {
        x(rx: any): this;
        x(): any;
        y(ry: any): this;
        y(): any;

        rx(rx: any): this;
        rx(): any;
        ry(ry: any): this;
        ry(): any;

        width(): number;
        width(width: any): this;
        height(): number;
        height(height: any): this;

        size(width: any, height: any): this;
        radius(x: number, y?: number): this;
    }
    export interface Circle extends CircleMethods { }
    export interface Ellipse extends CircleMethods { }
    interface Container {
        circle(size?: any): Circle;
        ellipse(width?: any, height?: any): Ellipse;
    }
    interface Library {
        Circle(): void;
        Ellipse(): void;
    }

    // event.js
    interface Element {
        on(event: string, cb: Function, context?: Object): this;
        off(event: string, cb: Function, context?: Object): this;
        fire(event: string, data?: any): this;

        click(cb: Function): this;
        dblclick(cb: Function): this;
        mousedown(cb: Function): this;
        mouseup(cb: Function): this;
        mouseover(cb: Function): this;
        mouseout(cb: Function): this;
        mousemove(cb: Function): this;
        touchstart(cb: Function): this;
        touchmove(cb: Function): this;
        touchleave(cb: Function): this;
        touchend(cb: Function): this;
        touchcancel(cb: Function): this;
    }

    //fx.js
    interface Library {
        easing: {
            '-'(pos: number): number;
            '<>'(pos: number): number;
            '>'(pos: number): number;
            '<'(pos: number): number;
        }
    }
    interface Element {
        animate(duration?: number, ease?: string, delay?: number): Animation;
        animate(info: { ease?: string; duration?: number; delay?: number }): Animation;
    }
    // TODO finishs FX

    // gradient.js
    export interface Stop extends Element {
        update(offset?: number | _Number, color?: any, opacity?: number | _Number): this;
        update(opts: { color: string | Color, offset: number | _Number, opacity: number | _Number }): this;
    }
    export interface Gradient extends Container {
        (type: string): Gradient;
        at(offset?: number | _Number, color?: any, opacity?: number | _Number): Stop;
        at(opts: { color: string | Color, offset: number | _Number, opacity: number | _Number }): Stop;
        update(block?: Function): this;
        fill(): this;
        toString(): string;
        from(x, y): this;
        to(x, y): this;
        radius(x: number, y?: number): this;
    }
    interface Container { gradient(type: string, block?: (stop: Gradient) => any): Gradient; }
    interface Library { gradient(type: string): void }

    // group.js
    export interface G extends Container {
        gbox(): BBox;
    }
    interface Container { group(): G; }
    interface Library { G(): void; }

    // hyperlink.js
    export interface A extends Container {
        to(url: any): this;
        show(target?: any): this;
        target(target: any): this;
    }
    interface Container { link(url?: string): A; }
    interface Element {
        linkTo(url: string): A;
        linkTo(url: (link: A) => any): A;
    }
    interface Library { A(): void; }

    // image.js
    export interface Image extends Shape {
        load(url?: string): this;
        loaded(cb: (image: Image, info: { width: number, height: number, ratio: number, url: string }) => any): this;
    }
    interface Container {
        image(): Image;
        image(href: string, size?: number): Image;
        image(href: string, width?: number, height?: number): Image;
    }
    interface Library { Image(): void; }

    // line.js
    export interface Line extends Shape {
        array(): PointArray;
        plot(points: number[][]): this;
        plot(x1: number, y1: number, x2: number, y2: number): this;
        move(x: number, y: number): this;
        size(width: number, height: number): this;
    }
    interface Container {
        line(points: number[][]): Line;
        line(x1: number, y1: number, x2: number, y2: number): Line;
    }
    interface Library { Line(): void; }

    // marker.js
    export interface Marker extends Container {
        ref(x, y): this;
        update(block: (marker: Marker) => any): this;
        toString(): string;
    }
    interface Container { marker(width?: number, height?: number, block?: (marker: Marker) => any): Marker }
    interface Defs { marker(width?: number, height?: number, block?: (marker: Marker) => any): Marker }
    interface _marker {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => any): Marker;
        marker(position: string, marker: Marker): Marker;
    }
    interface Line extends _marker { }
    interface Polyline extends _marker { }
    interface Polygon extends _marker { }
    interface Path extends _marker { }
    interface Library { Marker(): void; }

    // mask.js
    export interface Mask extends Container {
        targets: Element[];
    }
    interface Container { mask(): Mask; }
    interface Element {
        maskWith(mask: Mask): this;
        maskWith(element: Element): this;
        masker: Mask;
        unmask(): this;
    }
    interface Library { Mask(): void; }

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
    export interface Matrix {
        (source: any): Matrix;
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
        extract(): MatrixExtract;
        clone(): Matrix;
        morph(matrix: Matrix): Matrix;
        at(pos: number): Matrix;
        multiply(matrix: Matrix): Matrix;
        inverse(): Matrix;
        translate(x: number, y: number): Matrix;
        scale(x: number, y?: number, cx?: number, cy?: number): Matrix;
        rotate(r: number, cx?: number, cy?: number): Matrix;
        flip(a: string, offset: number): Matrix;
        skew(x: number, y: number, cx: number, cy: number): Matrix;
        skewX(x: number, cx?: number, cy?: number): Matrix;
        skewY(y: number, cx?: number, cy?: number): Matrix;
        around(cx: number, cy: number, matrix: Matrix): Matrix;
        native(): SVGMatrix;
        toString(): string;
    }
    interface Container {
        ctm(): Matrix;
        screenCTM(): Matrix;
    }
    interface Library { Martix(): void }

    // memory.js
    interface Element {
        remember(name: string, value: any): this;
        remember(obj: Object): this;
        remember(name: string): any;
        forget(...keys: string[]): this;
        forget(): this;
        memory(): Object;
    }

    // nested.js
    export interface Nested extends Container { }
    interface Container { nested(): Nested; }
    interface Library { Nested(): void; }

    // number.js
    interface _Number {
        (value: any, unit?: any): _Number;
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
    interface Library { Number(value: any, unit?: any): _Number; }

    // parent.js
    export interface Parent extends Element {
        children(): Element[];
        add(element: Element, i?: number): this;
        put(element: Element, i?: number): Element;
        has(element: Element): boolean;
        index(element: Element): number;
        get(i: number): Element;
        first(): Element;
        last(): Element;
        each(block: Function, deep?: boolean): this;
        removeElement(element: Element): this;
        clear(): this;
        defs(): Defs;
    }

    // path.js
    export interface Path extends Shape {
        morphArray: PathArray;
        array(): PathArray;
        plot(d: string): this;
        plot(pathArray: PathArray): this;
    }
    interface Container {
        path(): Path;
        path(d: string): Path;
        plot(pathArray: PathArray): Path;
    }

    // pathArray.js
    interface PathArrayPoint extends Array<any> { }
    export interface PathArray extends _Array {
        (d: string): PathArray;
        (array: PathArrayPoint[]): PathArray;
        move(x: number, y: number): this;
        size(width: number, height: number): this;
        parse(array: any[]): any[];
        bbox(): BBox;
    }
    interface Library {
        PathArray(d: string): void;
        PathArray(points: PathArrayPoint[]): void;
    }

    // pattern.js
    export interface Pattern extends Container {
        update(block: (pattern: Pattern) => any): this;
        toString(): string;
    }
    interface Container {
        pattern(width?: number, height?: number, block?: (pattern: Pattern) => any): Pattern
    }
    interface Library { Pattern(): void }

    // point.js
    interface ArrayPoint extends Array<number> { }
    export interface Point {
        (): Point;
        (position: ArrayPoint): Point;
        (position: { x: number, y: number }): Point;
        (x: number, y: number): Point;

        clone(): Point;
        morph(point: Point): Point;
        at(pos: number): Point;
        native(): SVGPoint;
        transform(matrix: Matrix): Point;
    }
    interface Library {
        Point(): void;
        Point(position: ArrayPoint): void;
        Point(position: { x: number, y: number }): void;
        Point(x: number, y: number): void;
    }
    interface Element {
        point(): Point;
        point(position: ArrayPoint): Point;
        point(position: { x: number, y: number }): Point;
        point(x: number, y: number): Point;
    }

    // pointArray.js
    export interface PointArray extends _Array {
        (points: string): PointArray;
        (points: ArrayPoint[]): PointArray;
        toStirng(): string;
        toLine(): {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        };
        parse(points: string): ArrayPoint[];
        move(x: number, y: number): this;
        size(width: number, height: number): this;
        bbox(): BBox;
    }
    interface Library {
        PointArray(points: string): void;
        PointArray(points: ArrayPoint[]): void;
    }

    // poly.js
    interface poly extends Shape {
        array(): PointArray;
        plot(p: string): this;
        plot(p: ArrayPoint[]): this;
        move(x: number, y: number): this;
        size(width: number, height: number): this;
    }
    export interface PolyLine extends poly { }
    interface Library { PolyLine(): void; }
    interface Container {
        polyLine(points: string): PolyLine;
        polyLine(points: ArrayPoint[]): PolyLine;
    }
    export interface Polygon extends poly { }
    interface Library { Polygon(): void; }
    interface Container {
        polygon(points: string): Polygon;
        polygon(points: ArrayPoint[]): Polygon;
    }

    // rect.js
    export interface Rect extends Shape { }
    interface Library { Rect(): void; }
    interface Container {
        rect(width?: number, height?: number): Rect;
    }

    // regex.js
    interface Library {
        regex: {
            numberAndUnit: RegExp;
            hex: RegExp;
            rgb: RegExp;
            reference: RegExp;
            matrix: RegExp;
            matrixElements: RegExp;
            whitespace: RegExp;
            isHex: RegExp;
            isRgb: RegExp;
            isCss: RegExp;
            isBlank: RegExp;
            isNumber: RegExp;
            isPercent: RegExp;
            isImage: RegExp;
            negExp: RegExp;
            comma: RegExp;
            hyphen: RegExp;
            pathLetters: RegExp;
            isPathLetter: RegExp;
            whitespaces: RegExp;
            X: RegExp;
        }
    }

    // selector.js
    interface Library {
        get(id: string): Element;
        select(query: string, parent: HTMLElement): Element;
    }
    interface Parent {
        select(query: string): Element;
    }

    // set.js
    export interface Set {
        (members?: Element[]): Set;
        add(...elments: Element[]): this;
        remove(element: Element): this;
        each(block: Function): this;
        clear(): this;
        length(): number;
        has(element: Element): this;
        index(element: Element): number;
        get(i: number): Element;
        first(): Element;
        last(): Element;
        valueOf(): Element[];
        bbox(): BBox;
    }
    interface Container { set(members?: Element[]): Set; }
    interface Library { Set(members?: Element[]): void; }

    // shape.js
    export interface Shape extends Element { }
    interface Library { Shape(): void; }

    // style.js
    interface Element {
        style(styles: Object): this;
        style(style: string): any;
        style(style: string, value: any): this;
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
    interface Element {
        fill(fill: { color?: string; opacity?: number, rule?: string }): this;
        fill(color: string): this;
        fill(pattern: Element): this;
        stroke(stroke: StrokeData): this;
        stroke(color: string): this;
        rotate(d: number, cx?: number, cy?: number): this;
        skew(x: number, y: number, cx?: number, cy?: number): this;
        scale(x: number, y: number, cx?: number, cy?: number): this;
        scale(scale: number): this;
        translate(x: number, y: number): this;
        flip(a: any, offset?: number): this;
        martix(m: any): this;
        opacity(o: number): this;
        opacity(): number;
        dx(x: number): this;
        dy(y: number): this;
        dmove(x: number, y: number): this;
    }
    interface Path {
        length(): number;
        pointAt(length: number): { x: number, y: number };
    }
    interface FontData {
        family?: string;
        size?: number;
        anchor?: string;
        leading?: string;
        weight?: string;
        style?: string
    }
    interface Parent {
        font(font: FontData): this;
    }
    interface Text {
        font(font: FontData): this;
    }

    // text.js
    export interface Text extends Shape {
        clone(): Text;
        text(): string;
        text(text: any): this;
        size(fontSize: number): this;
        leading(fontSize: number): this;
        lines(): number;
        rebuild(enabled: boolean): this;
        build(enabled: boolean): this;
        plain(text: any): this;
        tspan(text: any): Tspan;
        clear(): this;
        length(): number;
    }
    interface Container {
        text(text: any): Text;
        plain(text: any): Text;
    }
    interface Library { Text(): void; }
    export interface Tspan extends Shape {
        text(): string;
        text(text: any): this;
        dx(x: number): this;
        dy(y: number): this;
        newLine(): this;
        plain(text: any): this;
        tspan(text: any): Tspan;
        clear(): this;
        length(): number;
    }

    // textpath.js
    export interface TextPath extends Parent { }
    interface Text {
        path(d: any): this;
        plot(d: any): this;
        track(): Element;
        textPath(): Element;
    }
    interface Library { TextPath(): void; }

    // transform.js
    interface Element {
        transform(t: Transform): Element;
        transform(): Transform;
        untransform(): this;
        matrixify(): Matrix;
        toParent(parent: Parent): this;
        toDoc(doc: Parent): this;
    }
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
        matrix?: string; // 1,0,0,1,0,0
        a?: number; // direct digits of matrix
        b?: number;
        c?: number;
        d?: number;
        e?: number;
        f?: number;
    }
    export interface Transformation {
        (...Transform): Transformation;
        (source: Transform, inversed?: boolean): Transformation;
        at(pos: number): Matrix;
    }
    export interface Translate extends Transformation { }
    export interface Rotate extends Transformation { }
    export interface Scale extends Transformation { }
    export interface Skew extends Transformation { }

    // ungroup.js
    interface Parent {
        ungroup(parent: Parent, depth?: number): this;
        flatten(parent: Parent, depth?: number): this;
    }

    // use.js
    export interface Use extends Shape {
        element(element: Element, file?: string): this;
    }
    interface Container {
        use(element: Element, file?: string): Use;
    }
    interface Library { Use(): void; }

    // utilities.js
    interface Library {
        utils: {
            map(arrya: any[], block: Function): any;
            radians(d: number): number;
            degrees(r: number): number;
        }
    }

    // viewbox.js
    interface ViewBox {
        (source: Element): ViewBox;
        (source: string): ViewBox;
        (source: any[]): ViewBox;
        x: number;
        y: number;
        width: number;
        height: number;
        zoom?: number;
    }
    interface Container {
        toString(): string;
        morph(v: { x: number, y: number, width: number, height: number }): this;
        morph(v: any[]): this;
        // at(pos:number):ViewBox;
    }
    interface Library {
        ViewBox(source: Element): void;
        ViewBox(source: string): void;
        ViewBox(source: any[]): void;
    }

    export interface Animation {
        stop(): Animation;

        attr(name: string, value: any, namespace?: string): Animation;
        attr(obj: Object): Animation;
        attr(name: string): any;

        viewbox(x: number, y: number, w: number, h: number): Animation;

        move(x: number, y: number, anchor?: boolean): Animation;
        x(x: number, anchor?: boolean): Animation;
        y(y: number, anchor?: boolean): Animation;

        center(x: number, y: number, anchor?: boolean): Animation;
        cx(x: number, anchor?: boolean): Animation;
        cy(y: number, anchor?: boolean): Animation;

        size(w: number, h: number, anchor?: boolean): Animation;
        during(cb: (pos: number) => void): Animation;
        to(value: number): Animation;
        after(cb: () => void): Animation;

        // TODO style, etc, bbox...
    }
}

declare var SVG: svgjs.Library;
declare module "svg.js" {
    export default SVG;
}
