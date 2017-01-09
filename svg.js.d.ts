export = svgjs;
export as namespace svgjs;

declare var svgjs: svgjs.Library;

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
        new (array?: any[], fallback?: any): _Array;
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
    interface Library { Array: _Array }

    // attr.js
    interface Element {
        attr(name: string): any;
        attr(obj: Object): this;
        attr(name: string, value: any, namespace?: string): this;
    }

    // bare.js
    export interface Bare extends Element {
        new (element: string, inherit?: any): Bare;
        words(text: any): this;
    }
    interface Parent {
        element(element: string, inherit?: any): Bare;
        symbol(): Bare;
    }
    interface Library { Bare: Bare; }

    // boxes.js
    export interface BBox {
        new (element?: Element): BBox;
        height: number;
        width: number;
        y: number;
        x: number;
        cx: number;
        cy: number;
        merge(bbox: BBox): BBox;
    }
    export interface RBox extends BBox {
        new (element?: Element): RBox;
    }
    export interface TBox extends BBox {
        new (element?: Element): TBox;
    }
    interface Container {
        bbox(): BBox;
        rbox(): RBox;
        tbox(): TBox;
    }
    interface Library {
        BBox: BBox;
        RBox: RBox;
        TBox: TBox;
    }

    // clip.js
    export interface ClipPath extends Container {
        new (): ClipPath;
    }
    interface Container {
        clip(): ClipPath;
    }
    interface Element {
        clipWith(element: Element): this;
        clipper: ClipPath;
        unclip(): this;
    }
    interface Library { ClipPath: ClipPath; }

    // color.js
    export interface Color {
        new (): Color;
        new (color: string): Color;
        new (color: Color): Color;
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
    interface Library { Color: Color; }

    // container.js
    export interface Container extends Parent {
        new (): Container;
        viewbox(): ViewBox;
        viewbox(v): this;
    }
    interface Library { Container: Container }

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
    export interface Defs extends Container {
        new (): Defs;
    }
    interface Library { Defs: Defs }

    // doc.js
    export interface Doc extends Container {
        new (): Doc;
        new (selector: string): Doc;
        new (domElement: HTMLElement): Doc;
        namespace(): this;
        defs(): Defs;
        parent(): HTMLElement;
        spof(spof): this;
        remove(): this;
    }
    interface Library { Doc: Doc; }

    // element.js
    export interface Element {
        new (): Element;
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
    interface Library { Element: Element; }

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
    export interface Circle extends CircleMethods {
        new (): Circle;
    }
    export interface Ellipse extends CircleMethods {
        new (): Ellipse;
    }
    interface Container {
        circle(size?: any): Circle;
        ellipse(width?: any, height?: any): Ellipse;
    }
    interface Library {
        Circle: Circle;
        Ellipse: Ellipse;
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
        new (): Stop;
        update(offset?: number | _Number, color?: any, opacity?: number | _Number): this;
        update(opts: { color: string | Color, offset: number | _Number, opacity: number | _Number }): this;
    }
    export interface Gradient extends Container {
        new (type?: string): Gradient;
        at(offset?: number | _Number, color?: any, opacity?: number | _Number): Stop;
        at(opts: { color: string | Color, offset: number | _Number, opacity: number | _Number }): Stop;
        update(block?: Function): this;
        fill(): this;
        toString(): string;
        from(x, y): this;
        to(x, y): this;
        radius(x: number, y?: number): this;
    }
    interface Container {
        gradient(type: string, block?: (stop: Gradient) => any): Gradient;
    }
    interface Library {
        Gradient: Gradient;
        Stop: Stop;
    }

    // group.js
    export interface G extends Container {
        new (): G;
        gbox(): BBox;
    }
    interface Container { group(): G; }
    interface Library { G: G; }

    // hyperlink.js
    export interface A extends Container {
        new (): A;
        to(url: any): this;
        show(target?: any): this;
        target(target: any): this;
    }
    interface Container { link(url?: string): A; }
    interface Element {
        linkTo(url: string): A;
        linkTo(url: (link: A) => any): A;
    }
    interface Library { A: A; }

    // image.js
    export interface Image extends Shape {
        new (): Image;
        load(url?: string): this;
        loaded(cb: (image: Image, info: { width: number, height: number, ratio: number, url: string }) => any): this;
        error(cb: (image: Image, info: { width: number, height: number, ratio: number, url: string }) => any): this;
    }
    interface Container {
        image(): Image;
        image(href: string, size?: number): Image;
        image(href: string, width?: number, height?: number): Image;
    }
    interface Library { Image: Image; }

    // line.js
    export interface Line extends Shape {
        new (): Line;
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
    interface Library { Line: Line; }

    // marker.js
    export interface Marker extends Container {
        new (): Marker;
        ref(x, y): this;
        update(block: (marker: Marker) => any): this;
        toString(): string;
    }
    interface Container {
        marker(width?: number, height?: number, block?: (marker: Marker) => any): Marker
    }
    interface Defs {
        marker(width?: number, height?: number, block?: (marker: Marker) => any): Marker
    }
    interface Line {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => any): Marker;
        marker(position: string, marker: Marker): Marker;
    }
    interface Polyline {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => any): Marker;
        marker(position: string, marker: Marker): Marker;
    }
    interface Polygon {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => any): Marker;
        marker(position: string, marker: Marker): Marker;
    }
    interface Path {
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => any): Marker;
        marker(position: string, marker: Marker): Marker;
    }
    interface Library {
        Marker: Marker;
    }

    // mask.js
    export interface Mask extends Container {
        new (): Mask;
        targets: Element[];
    }
    interface Container { mask(): Mask; }
    interface Element {
        maskWith(mask: Mask): this;
        maskWith(element: Element): this;
        masker: Mask;
        unmask(): this;
    }
    interface Library { Mask: Mask; }

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
        new (): Matrix;
        new (source: string): Matrix;
        new (element: Element): Matrix;
        new (a: number, b: number, c: number, d: number, e: number, f: number): Matrix;
        new (source: {a: number, b: number, c: number, d: number, e: number, f: number}): Matrix;
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
    interface Library { Matrix: Matrix }

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
    export interface Nested extends Container {
        new (): Nested;
    }
    interface Container { nested(): Nested; }
    interface Library { Nested: Nested; }

    // number.js
    interface _Number {
        new (): _Number;
        new (value: _Number): _Number;
        new (value: string): _Number;
        new (value: number, unit?: any): _Number;
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
    interface Library { Number: _Number; }

    // parent.js
    export interface Parent extends Element {
        new (): Parent;
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
    interface Library{ Parent: Parent }

    // path.js
    export interface Path extends Shape {
        new (): Path;
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
    interface Library{ Path: Path }

    // pathArray.js
    interface PathArrayPoint extends Array<any> { }
    export interface PathArray extends _Array {
        new (): PathArray;
        new (d: string): PathArray;
        new (array: PathArrayPoint[]): PathArray;
        move(x: number, y: number): this;
        size(width: number, height: number): this;
        parse(array: any[]): any[];
        bbox(): BBox;
    }
    interface Library { PathArray: PathArray; }

    // pattern.js
    export interface Pattern extends Container {
        new (): Pattern;
        update(block: (pattern: Pattern) => any): this;
        toString(): string;
    }
    interface Container {
        pattern(width?: number, height?: number, block?: (pattern: Pattern) => any): Pattern
    }
    interface Library { Pattern: Pattern }

    // point.js
    interface ArrayPoint extends Array<number> { }
    export interface Point {
        new (): Point;
        new (position: ArrayPoint): Point;
        new (point: Point): Point;
        new (position: { x: number, y: number }): Point;
        new (x: number, y: number): Point;

        clone(): Point;
        morph(point: Point): Point;
        at(pos: number): Point;
        native(): SVGPoint;
        transform(matrix: Matrix): Point;
    }
    interface Library { Point: Point; }
    interface Element {
        point(): Point;
        point(position: ArrayPoint): Point;
        point(position: { x: number, y: number }): Point;
        point(x: number, y: number): Point;
    }

    // pointArray.js
    export interface PointArray extends _Array {
        new (): PointArray;
        new (points: string): PointArray;
        new (points: ArrayPoint[]): PointArray;
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
    interface Library { PointArray: PointArray }

    // poly.js
    interface poly extends Shape {
        array(): PointArray;
        plot(p: string): this;
        plot(p: ArrayPoint[]): this;
        move(x: number, y: number): this;
        size(width: number, height: number): this;
    }
    export interface PolyLine extends poly {
        new (): PolyLine;
    }
    interface Library { PolyLine: PolyLine; }
    interface Container {
        polyLine(points: string): PolyLine;
        polyLine(points: ArrayPoint[]): PolyLine;
    }
    export interface Polygon extends poly {
        new (): Polygon;
    }
    interface Library { Polygon: Polygon; }
    interface Container {
        polygon(points: string): Polygon;
        polygon(points: ArrayPoint[]): Polygon;
    }

    // rect.js
    export interface Rect extends Shape {
        new (): Rect;
    }
    interface Library { Rect: Rect; }
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
        new (members?: Element[]): Set;
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
    interface Library { Set: Set; }

    // shape.js
    export interface Shape extends Element {
        new (): Shape;
    }
    interface Library { Shape: Shape; }

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
        matrix(m: any): this;
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
        new (): Text;
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
    interface Library { Text: Text; }
    export interface Tspan extends Shape {
        new (): Tspan;
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
    interface Library { Tspan: Tspan; }

    // textpath.js
    export interface TextPath extends Parent {
        new (): TextPath;
    }
    interface Text {
        path(d: any): this;
        plot(d: any): this;
        track(): Element;
        textPath(): Element;
    }
    interface Library { TextPath: TextPath; }

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
        new (...Transform): Transformation;
        new (source: Transform, inversed?: boolean): Transformation;
        at(pos: number): Matrix;
    }
    export interface Translate extends Transformation {new (): Translate}
    export interface Rotate extends Transformation {new (): Rotate}
    export interface Scale extends Transformation {new (): Scale}
    export interface Skew extends Transformation {new (): Skew}
    interface Library {
        Transformation: Transformation;
        Translate: Translate;
        Rotate: Rotate;
        Scale: Scale;
        Skew: Skew;
    }

    // ungroup.js
    interface Parent {
        ungroup(parent: Parent, depth?: number): this;
        flatten(parent: Parent, depth?: number): this;
    }

    // use.js
    export interface Use extends Shape {
        new (): Use;
        element(element: Element, file?: string): this;
    }
    interface Container {
        use(element: Element, file?: string): Use;
    }
    interface Library { Use: Use; }

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
        new (source: Element): ViewBox;
        new (source: string): ViewBox;
        new (source: any[]): ViewBox;
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
    interface Library { ViewBox: ViewBox; }

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