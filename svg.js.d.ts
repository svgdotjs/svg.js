declare class BuiltInArray<T> extends Array<T> { }

declare module "@svgdotjs/svg.js" {

    function SVG(): Svg;
    function SVG(selector: QuerySelector): Element;
    function SVG<T>(el: T): SVGTypeMapping<T>
    function SVG(domElement: HTMLElement): Element;

    function eid(name: string): string;
    function get(id: string): Element;

    function create(name: string): any;
    function extend(parent: Object, obj: Object): void;
    function invent(config: Object): any;
    function adopt(node: HTMLElement): Element;
    function prepare(element: HTMLElement): void;
    function getClass(name: string): Element;

    function on(el: Node, events: string, cb: EventListener, binbind?: any, options?: AddEventListenerOptions): void;
    function on(el: Node, events: Event[], cb: EventListener, binbind?: any, options?: AddEventListenerOptions): void;

    function off(el: Node, events?: string, cb?: EventListener | number): void;
    function off(el: Node, events?: Event[], cb?: EventListener | number): void;

    function dispatch(node: Node, event: Event, data?: Object): Event

    function find(query: QuerySelector): List<Element>
    function findOne(query: QuerySelector): Element

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
        },
        timeline: {
            duration: number;
            ease: string;
            delay: number;
        }
    }
    let easing: {
        '-'(pos: number): number;
        '<>'(pos: number): number;
        '>'(pos: number): number;
        '<'(pos: number): number;
        bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number;
        steps(steps: number, stepPosition?: string): (t: number, beforeFlag?: boolean) => number;
    }

    let regex: {
        delimiter: RegExp;
        dots: RegExp;
        hex: RegExp;
        hyphen: RegExp;
        isBlank: RegExp;
        isCss: RegExp;
        isHex: RegExp;
        isImage: RegExp;
        isNumber: RegExp;
        isPathLetter: RegExp;
        isPercent: RegExp;
        isRgb: RegExp;
        numberAndUnit: RegExp;
        numbersWithDots: RegExp;
        pathLetters: RegExp;
        reference: RegExp;
        rgb: RegExp;
        transforms: RegExp;
        whitespace: RegExp;
    }

    let namespaces: {
        ns: string;
        xmlns: string;
        xlink: string;
        svgjs: string;
    }

    interface LinkedHTMLElement extends HTMLElement {
        instance: Element;
    }

    // array.js
    // ************ Standard object/option/properties declaration ************

    type AttrNumberValue = number | "auto"

    /**
     * The SVG core attributes are all the common attributes that can be specified on any SVG element.
     * More information see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Core
     */
    interface CoreAttr {
        id?: string
        lang?: string
        tabindex?: number
        "xml:lang"?: string
    }

    /**
     * The SVG styling attributes are all the attributes that can be specified on any SVG element to apply CSS styling effects.
     * More information see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Styling
     */
    interface StylingAttr {
        /**
         * a valid HTML class name
         */
        class?: string
        /**
         * SVG css style string format. It all can be find here https://www.w3.org/TR/SVG/styling.html#StyleAttribute
         */
        style?: string
    }

    /**
     * A global attribute that can be use with any svg element
     */
    interface GlobalAttr extends CoreAttr, StylingAttr { }

    // TODO: implement SVG Presentation Attributes. See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation

    interface PathBaseAttr {
        pathLength?: number
    }

    interface RadiusAxisAttr {
        rx?: AttrNumberValue
        ry?: AttrNumberValue
    }

    /**
     * SVG Rectangle attribute, more information see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect
     */
    interface RectAttr extends RadiusAxisAttr, PathBaseAttr, GlobalAttr {
        x?: number
        y?: number
        width: AttrNumberValue
        height: AttrNumberValue
    }

    /**
     * SVG Line attribute, more information see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line
     */
    interface LineAttr extends PathBaseAttr, GlobalAttr {
        x1?: number
        y1?: number
        x2?: number
        y2?: number
    }

    /**
     *
     */
    interface ShapeElementStyle {

    }

    interface PathLikeElementStyle {

    }

    interface TextElementStyle {

    }

    interface GraphicElementStyle {

    }

    interface ContainerElementStyle {

    }

    interface CoordinateSystemElementStyle {

    }

    type SVGStyleDeclaration = ShapeElementStyle | PathLikeElementStyle | TextElementStyle | GraphicElementStyle | ContainerElementStyle | CoordinateSystemElementStyle

    /**
     * A generic Dom Box object.
     * Notice: Object is still in experiment state and document is not complete (Draft)
     * See https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
     */
    interface DOMRect {
        x?: number
        y?: number
        width?: number
        height?: number
        top?: number
        right?: number
        bottom?: number
        left?: number
    }

    // ************ SVG.JS generic Conditional Types declaration ************

    type SVGTypeMapping<T> =
        T extends HTMLElement ? Dom :
        T extends SVGSVGElement ? Svg :
        T extends SVGRectElement ? Rect :
        T extends SVGCircleElement ? Circle :
        T extends SVGPathElement ? Path :
        T extends SVGTextElement ? Text :
        T extends SVGTextPathElement ? TextPath :
        T extends SVGGElement ? G :
        T extends SVGLineElement ? Line :
        T extends SVGPolylineElement ? Polyline :
        T extends SVGPolygonElement ? Polygon :
        T extends SVGGradientElement ? Gradient :
        T extends SVGImageElement ? Image :
        T extends SVGEllipseElement ? Ellipse :
        T extends SVGMaskElement ? Mask :
        T extends SVGMarkerElement ? Marker :
        T extends SVGClipPathElement ? ClipPath :
        T extends SVGTSpanElement ? Tspan :
        T extends SVGSymbolElement ? Symbol :
        T extends SVGUseElement ? Use : Element

    // element type as string
    type SvgType = "svg"
    type ClipPathType = "clipPath"
    type TextType = "text"
    type GType = "g"
    type AType = "a"

    type ParentElement = SvgType | GType | AType

    type AttrTypeMapping<T> =
        T extends Rect ? RectAttr : GlobalAttr

    type StyleTypeMapping<T> =
        T extends Element ? SVGStyleDeclaration : CSSStyleDeclaration

    type ElementAlias = Dom | Svg | Rect | Line | Polygon | Polyline | Ellipse | ClipPath | Use |
        Text | Path | TextPath | Circle | G | Gradient | Image | Element

    type AttributeReference = "href" | "marker-start" | "marker-mid" | "marker-end" | "mask" |
        "clip-path" | "filter" | "fill"

    // ************* SVG.JS Type Declaration *************
    // ********** Locate in directory src/types **********

    // SVGArray.js
    /**
     * Type alias to native array.
     *
     * **Caution**: If argument is a string, generic type must be a number or array of number and
     * the string is format as a concatenate of number separate by comma.
     * This is expensive to build runtime type check for such as case so please use it carefully.
     */
    type ArrayAlias<T> = BuiltInArray<T> | T[] | string

    class Array<T> extends BuiltInArray<T> {
        constructor(array?: ArrayAlias<T>);

        /**
         * Return array of generic T however it's flatten array by 1 level as it using `apply` function.
         * For example: if T is a `number[]` which is the number of 2 dimension `Array<number[]>` the result will be `number[]`
         */
        toArray(): any[]
        /**
         * return a concatenated string of each element separated by space
         */
        toString(): string
        valueOf(): T[]
        clone(): Array<T>
        toSet(): Set<T>
        parse(a?: ArrayAlias<T>): T[]
        to(a: any): Morphable;
    }

    // point.js
    class Point {
        x: number;
        y: number;
        constructor();
        constructor(position: CoordinateXY);
        constructor(point: Point);
        constructor(x: number, y?: number);
        clone(): Point;
        transform(matrix: Matrix): this;
        transformO(matrix: Matrix): this;
        toArray(): ArrayXY;
    }

    // pointArray.js
    class PointArray extends Array<ArrayXY> {
        constructor();
        constructor(array?: ArrayAlias<ArrayXY> | number[]);
        // Note: override constructor from SVGArray to allow array of number
        new(array?: ArrayAlias<ArrayXY> | number[]);

        toLine(): LineAttr;
        at(pos: number): PointArray;
        transform(m: Matrix | MatrixLike): PointArray
        move(x: number, y: number): this;
        size(width: number, height: number): this;
        bbox(): Box;
        to(a: any): Morphable;
        toString(): string;
    }

    // SVGNumber.js
    type NumberUnit = [number, string]

    class Number {
        constructor();
        constructor(value: Number);
        constructor(value: string);
        constructor(value: number, unit?: any);
        constructor(n: NumberUnit);

        value: number
        unit: any

        toString(): string;
        toJSON(): Object;  // same as toString
        toArray(): NumberUnit
        valueOf(): number;
        plus(number: NumberAlias): Number;
        minus(number: NumberAlias): Number;
        times(number: NumberAlias): Number;
        divide(number: NumberAlias): Number;
        convert(unit: string): Number;
        to(a: any): Morphable
    }

    type NumberAlias = Number | number | string;

    // PathArray.js

    type LineCommand = ['M' | 'm' | 'L' | 'l', number, number] | ['H' | 'h' | 'V' | 'v', number] | ['Z' | 'z']

    type CurveCommand =
        // Bezier Curves
        ['C' | 'c', number, number, number, number, number, number] |
        ['S' | 's' | 'Q' | 'q', number, number, number, number] | ['T' | 't', number, number] |
        // Arcs
        ['A' | 'a', number, number, number, number, number, number, number]

    type PathCommand = LineCommand | CurveCommand

    type PathArrayAlias = PathArray | PathCommand[] | (string | number)[] | string;

    class PathArray extends Array<PathCommand> {
        constructor();
        constructor(d: ArrayAlias<PathCommand> | PathArrayAlias);

        move(x: number, y: number): this;
        size(width: number, height: number): this;
        equalCommands(other: PathArray): boolean
        morph(pa: PathArray): this
        at(pos: number): PathArray
        parse(array: ArrayAlias<PathCommand> | PathArrayAlias): PathCommand[];
        bbox(): Box;
        to(a: any): Morphable
    }

    // Matrix.js
    interface TransformData {
        origin?: number[];
        scaleX?: number;
        scaleY?: number;
        shear?: number;
        rotate?: number;
        translateX?: number;
        translateY?: number;
        originX?: number;
        originY?: number;
    }

    interface MatrixLike {
        a?: number;
        b?: number;
        c?: number;
        d?: number;
        e?: number;
        f?: number;
    }

    interface MatrixExtract extends TransformData, MatrixLike { }

    type FlipType = 'both' | 'x' | 'y' | boolean
    type ArrayXY = [number, number]
    type CoordinateXY = ArrayXY | { x: number, y: number }

    interface MatrixTransformParam {
        flip?: FlipType
        skew?: ArrayXY | number
        skewX?: number
        skewY?: number
        scale?: ArrayXY | number
        scaleX?: number
        scaleY?: number
        shear?: number
        theta?: number
        origin?: CoordinateXY
        around?: CoordinateXY
        ox?: number
        originX?: number
        oy?: number
        originY?: number
        position?: CoordinateXY
        px?: number
        positionX?: number
        py?: number
        positionY?: number
        translate?: CoordinateXY
        tx?: number
        translateX?: number
        ty?: number
        translateY?: number
        relative?: CoordinateXY
        rx?: number
        relativeX?: number
        ry?: number
        relativeY?: number
    }

    type MatrixAlias = MatrixLike | TransformData | MatrixTransformParam | number[] | Element | string;

    class Matrix implements MatrixLike {
        constructor();
        constructor(source: MatrixAlias);
        constructor(a: number, b: number, c: number, d: number, e: number, f: number);

        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;

        clone(): Matrix;
        transform(o: MatrixLike | MatrixTransformParam): Matrix
        compose(o: MatrixExtract): Matrix
        decompose(cx?: number, cy?: number): MatrixExtract
        multiply(m: MatrixAlias | Matrix): Matrix;
        multiplyO(m: MatrixAlias | Matrix): this;
        lmultiply(m: MatrixAlias | Matrix): Matrix;
        lmultiplyO(m: MatrixAlias | Matrix): this;
        inverse(): Matrix;
        inverseO(): this;
        translate(x?: number, y?: number): Matrix;
        translateO(x?: number, y?: number): this;
        scale(x: number, y?: number, cx?: number, cy?: number): Matrix;
        scaleO(x: number, y?: number, cx?: number, cy?: number): this;
        rotate(r: number, cx?: number, cy?: number): Matrix;
        rotateO(r: number, cx?: number, cy?: number): this;
        flip(a: NumberAlias, offset?: number): Matrix;
        flipO(a: NumberAlias, offset?: number): this;
        flip(offset?: number): Matrix;
        shear(a: number, cx?: number, cy?: number): Matrix;
        shearO(a: number, cx?: number, cy?: number): this;
        skew(y?: number, cx?: number, cy?: number): Matrix;
        skewO(y?: number, cx?: number, cy?: number): this;
        skew(x: number, y?: number, cx?: number, cy?: number): Matrix;
        skewX(x: number, cx?: number, cy?: number): Matrix;
        skewY(y: number, cx?: number, cy?: number): Matrix;
        around(cx?: number, cy?: number, matrix?: Matrix): Matrix;
        aroundO(cx?: number, cy?: number, matrix?: Matrix): this;
        equals(m: Matrix): boolean
        toString(): string;
        toArray(): number[];
        valueOf(): MatrixLike;
        to(a: any): Morphable;
    }

    // List.js
    interface List<T> extends Array<T> {
        each(fn: Function): void
        each(...args: any[]): void
        toArray(): T[]
    }

    // EventTarget.js
    interface EventTarget {
        events: Object

        addEventListener(): void
        dispatch(event: Event | string, data?: object): Event
        dispatchEvent(event: Event): boolean
        fire(event: Event | string, data?: object): this
        getEventHolder(): this | Node
        getEventTarget(): this | Node

        on(events: string | Event[], cb: EventListener, binbind?: any, options?: AddEventListenerOptions): this;
        off(events?: string | Event[], cb?: EventListener | number): this;

        removeEventListener(): void
    }

    // Color.js
    interface ColorLike {
        r: number;
        g: number;
        b: number;

        x: number;
        y: number;
        z: number;

        h: number;
        s: number;
        l: number;
        a: number;
        c: number;

        m: number;
        k: number;

        space: string;
    }

    type ColorAlias = string | ColorLike;

    class Color implements ColorLike {
        r: number;
        g: number;
        b: number;

        x: number;
        y: number;
        z: number;

        h: number;
        s: number;
        l: number;
        a: number;
        c: number;

        m: number;
        k: number;

        space: string;
        constructor()
        constructor(color: ColorAlias, space?: string);
        constructor(a: number, b: number, c: number, space?: string)
        constructor(a: number, b: number, c: number, d: number, space?: string)
        constructor(a: number[], space?: string)

        brightness(): number;
        morph(color: ColorAlias): Color;
        at(pos: number): Color;

        rgb(): Color
        lab(): Color
        xyz(): Color
        lch(): Color
        hsl(): Color
        cmyk(): Color
        toHex(): string
        toString(): string
        toRgb(): string
        toArray(): any[]

        to(a: any): Morphable
        fromArray(a: any): this
    }

    // Box.js
    interface BoxLike {
        height?: number;
        width?: number;
        y?: number;
        x?: number;
        cx?: number;
        cy?: number;
        w?: number;
        h?: number;
        x2?: number;
        y2?: number;
    }

    class Box implements BoxLike {
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

        constructor();
        constructor(source: string);
        constructor(source: number[]);
        constructor(source: DOMRect);
        constructor(x: number, y: number, width: number, height: number);

        merge(box: Box): Box;
        transform(m: Matrix): Box
        addOffset(): this;
        toString(): string;
        toArray(): number[];
        isNulled(): boolean;
        to(v: MorphValueLike): Morphable;
    }

    // Morphable.js
    type MorphValueLike = string | number | ObjectBag | NonMorphable | MatrixExtract | Array<any> | any[]

    class Morphable {
        constructor();
        constructor(st: Stepper);

        from(): MorphValueLike
        from(v: MorphValueLike): this
        to(): MorphValueLike
        to(v: MorphValueLike): this
        type(): any
        type(t: any): this
        stepper(): Stepper
        stepper(st: Stepper): this
        done(): boolean
        at(pos: number): any
    }

    class ObjectBag {
        constructor();
        constructor(a: Object);
        valueOf(): Object
        toArray(): Object[]

        to(a: Object): Morphable
        fromArray(a: any[]): this
    }

    class NonMorphable {
        constructor(a: Object)
        valueOf(): Object
        toArray(): Object[]

        to(a: Object): Morphable
        fromArray(a: Object): this
    }

    // TODO: check & verify ??????
    class TransformBag {
        constructor()
        constructor(a: number[])
        constructor(a: TransformData)
        defaults: TransformData
        toArray(): number[]
        to(t: TransformData): Morphable
        fromArray(t: number[]): this
    }

    interface Stepper {
        done(c?: object): boolean
    }

    class Ease implements Stepper {
        constructor()
        constructor(fn: string)
        constructor(fn: Function)

        step(from: number, to: number, pos: number): number
        done(): boolean
    }

    class Controller implements Stepper {
        constructor(fn?: Function)
        step(current: number, target: number, dt: number, c: number): number
        done(c?: object): boolean
    }

    // Queue.js
    interface QueueParam {
        value: any
        next?: any
        prev?: any
    }

    class Queue {
        constructor();

        push(value: any): QueueParam
        shift(): any
        first(): number
        last(): number
        remove(item: QueueParam): void
    }

    // Timeline.js
    class Timeline extends EventTarget {
        constructor()
        constructor(fn: Function)

        schedule(runner?: Runner, delay?: number, when?: string): this
        unschedule(runner: Runner): this
        getEndTime(): number
        updateTime(): this
        play(): this
        pause(): this
        stop(): this
        finish(): this
        speed(speed: number): this
        reverse(yes: boolean): this
        seek(dt: number): this
        time(): number
        time(time: number): this
        source(): Function
        source(fn: Function): this
    }

    // Runner.js
    interface TimesParam {
        duration: number
        delay: number
        when: number | string
        swing: boolean
        wait: number
        times: number
    }

    type TimeLike = number | TimesParam | Stepper

    class Runner {
        constructor();
        constructor(options: Function);
        constructor(options: number);
        constructor(options: object);
        constructor(options: Controller);

        /**
         * DO NOT USE any of this, it only for testing purpose
         */
        _time: number
        _duration: number
        _wait: number
        _times: number
        _swing: boolean
        _reverse: boolean

        static sanitise: (duration?: TimeLike, delay?: number, when?: string) => Object

        element(): Element
        element(el: Element): this
        timeline(): Timeline
        timeline(timeline: Timeline): this
        animate(duration: number, delay?: number, when?: string): this
        schedule(delay: number, when?: string): this
        schedule(timeline: Timeline, delay?: number, when?: string): this
        unschedule(): this
        loop(times?: number, swing?: boolean, wait?: number): this
        loop(times: TimesParam): this
        delay(delay: number): this

        during(fn: Function): this
        queue(initFn: Function, runFn: Function, retargetFn?: boolean | Function, isTransform?: boolean): this
        after(fn: EventListener): this
        time(): number
        time(time: number): this
        duration(): number
        loops(): number
        loops(p: number): this
        position(): number
        position(p: number): this
        progress(): number
        progress(p: number): this
        step(deta?: number): this
        reset(): this
        finish(): this
        reverse(r?: boolean): this
        ease(fn: Function): this
        active(): boolean
        active(a: boolean): this
        addTransform(m: Matrix): this
        clearTransform(): this
        clearTransformsFromQueue(): void

        // extends prototypes
        attr(a: string | Object, v?: string): this
        css(s: string | Object, v?: string): this
        styleAttr(type: string, name: string | Object, val?: string): this
        zoom(level: NumberAlias, point: Point): this
        transform(transforms: MatrixTransformParam, relative?: boolean, affine?: boolean): this
        x(x: number): this
        y(y: number): this
        dx(dx: number): this
        dy(dy: number): this
        cx(x: number): this
        cy(y: number): this
        move(x: number, y: number): this
        center(x: number, y: number): this
        size(width: number, height: number): this
        width(width: number): this
        height(height: number): this
        plot(a: Object): this
        plot(a: number, b: number, c: number, d: number): this
        leading(value: number): this
        viewbox(x: number, y: number, width: number, height: number): this
        update(offset: number, color: number, opacity: number): this
        update(o: StopProperties): this
        rx(): number
        rx(rx: number): this
        ry(): number
        ry(ry: number): this
        from(x: NumberAlias, y: NumberAlias): this
        to(x: NumberAlias, y: NumberAlias): this
    }

    // Animator.js
    let Animator: {
        nextDraw: any
        frames: Queue
        timeouts: Queue
        immediates: Queue

        timer(): boolean
        frame(fn: Function): Object
        timeout(fn: Function, delay?: number): Object
        immediate(fn: Function): Object
        cancelFrame(o: Object): void
        clearTimeout(o: Object): void
        cancelImmediate(o: Object): void
    }

    type ParentTypeAlias = Svg | G | A;

    /**
     * Just fancy type alias to refer to css query selector.
     */
    type QuerySelector = string

    // cannot really avoid using anonymous any string as typescript does not provide
    // runtime type check for example, QuerySelector should contain . or # at least
    // Important: this type alias is provided an overview of how value look as a string
    type ParentQueryAlias = ParentElement | keyof HTMLElementTagNameMap | ParentTypeAlias | QuerySelector

    type ParentQueryMapping<T> =
        T extends Tspan | TextPath ? ParentQueryAlias | TextType | ClipPathType | Text | ClipPath | Dom :
        T extends Shape ? ParentQueryAlias | ClipPathType | ClipPath | Dom :
        T extends Element ? ParentQueryAlias | Dom : keyof HTMLElementTagNameMap | Dom

    type ParentQueryResultMapping<T> =
        T extends Tspan | TextPath ? ParentTypeAlias | Text | ClipPath | Dom :
        T extends Shape ? ParentTypeAlias | ClipPath | Dom : ParentTypeAlias | Dom

    type PutInMapping<T> =
        T extends Svg ? ParentTypeAlias | Dom | HTMLElement | string :
        T extends Shape ? ParentTypeAlias | ClipPath | string :
        T extends Element ? ParentTypeAlias | string : HTMLElement | string

    type PutInResultMapping<T> =
        T extends Svg ? ParentTypeAlias | Dom :
        T extends Element ? ParentTypeAlias : Dom

    class Dom implements EventTarget {
        node: HTMLElement | SVGElement;
        type: string;

        constructor(node?: HTMLElement, attr?: Object);
        constructor(att: Object);
        add(element: Element, i?: number): this;
        addTo(parent: Dom | HTMLElement | string): this
        children(): List<Element>;
        clear(): this;
        clone(): this;
        each(block: (index: number, children: Element[]) => void, deep?: boolean): this;
        element(element: string, inherit?: Object): this;
        first(): Element;
        get(i: number): Element;
        getEventHolder(): LinkedHTMLElement;
        getEventTarget(): LinkedHTMLElement;
        has(element: Element): boolean;
        id(): string
        id(id: string): this
        index(element: Element): number;
        last(): Element;
        matches(selector: string): boolean;
        /**
         * Get the parent of current element. The input query can be given with string, object type or none (undefined).
         * The input is vary based on the implement in hierarchy of SVG.JS element or dom.
         * 1. If The input is a string, the string value must be a valid HTML element tag name or svg tag name. e.g "svg" or "g" or "div"
         * 2. If the given input is an object type then only SVG.JS object type is accept. e.g Dom, Svg or G
         * 3. if the given input query is undefined then the element will return the closest parent in Dom hierarchy
         *
         * For more information see ParentQueryMapping.
         * @param type can be either string, object type or undefined.
         */
        parent<T extends this>(type?: ParentQueryMapping<T>): ParentQueryResultMapping<T>;
        put(element: Element, i?: number): Element;
        /**
         * Put the element into the given parent element. The input parent element can be vary base on the class implementation.
         * 1. If the current class is a Dom then parent input is only accept a valid HTML element or a valid string id of HTML element
         * 2. If the current class is an Svg then parent input can only Dom, Svg, G, A, a valid HTML element and a valid string id of HTML element
         *
         * For more information see PutInMapping.
         * @param parent an object of SVG.JS Dom or implement container or a string id or a valid HTML element object.
         */
        putIn<T extends this>(parent: PutInMapping<T>): PutInResultMapping<T>;

        remove(): this;
        removeElement(element: Element): this;
        replace<T extends Dom>(element: T): T;
        round(precision?: number, map?: string[]): this
        svg(): string;
        svg(a: string, outer: true): Element;
        svg(a: string, outer?: false): this;
        svg(a: boolean, outer?: boolean): string;
        svg(a: null | Function, outer?: boolean): string;

        toString(): string;
        words(text: string): this;
        writeDataToDom(): this;

        // prototype extend Attribute in attr.js
        /**
         * Get the attribute object of SVG Element. The return object will be vary based on
         * the instance itself. For example, G element will only return GlobalAttr where Rect
         * will return RectAttr instead.
         */
        // attr<T extends this>(): AttrTypeMapping<T>;
        attr(): any;
        /**
         * Add or update the attribute from the SVG Element. To remove the attribute from the element set value to null
         * @param name name of attribute
         * @param value value of attribute can be string or number or null
         * @param namespace optional string that define namespace
         */
        attr(name: string, value: any, namespace?: string): this;
        attr(name: string): any;
        attr(obj: Object): this;
        attr(obj: Object[]): Object;

        // prototype extend Selector in selector.js
        find(query: string): List<Element>
        findOne(query: string): Dom

        // prototype method register in data.js
        data(a: string): Object | string | number
        data(a: string, v: Object, substain?: boolean): this
        data(a: Object): this

        // prototype method register in arrange.js
        siblings(): List<Element>
        position(): number
        next(): Element
        prev(): Element
        forward(): this
        backward(): this
        front(): this
        back(): this
        before(el: Element): Element
        after(el: Element): Element
        insertBefore(el: Element): this
        insertAfter(el: Element): this

        // prototype method register in class.js
        classes(): string[]
        hasClass(name: string): boolean
        addClass(name: string): this
        removeClass(name: string): this
        toggleClass(name: string): this

        // prototype method register in css.js
        css<T extends this>(): StyleTypeMapping<T>;
        css<T extends this>(style: string[]): StyleTypeMapping<T>;
        css(style: string): string
        css<T extends this>(style: StyleTypeMapping<T>): this
        css(style: string, val: any): this
        show(): this
        hide(): this
        visible(): boolean

        // memory.js
        remember(name: string, value: any): this;
        remember(name: string): any;
        remember(obj: Object): this;
        forget(...keys: string[]): this;
        forget(): this;
        memory(): Object;
        events: Object

        addEventListener(): void
        dispatch(event: Event | string, data?: object): Event
        dispatchEvent(event: Event): boolean
        fire(event: Event | string, data?: object): this
        getEventHolder(): this | Node
        getEventTarget(): this | Node

        on(events: string | Event[], cb: EventListener, binbind?: any, options?: AddEventListenerOptions): this;
        off(events?: string | Event[], cb?: EventListener | number): this;
        removeEventListener(): void
    }

    // clip.js
    class ClipPath extends Container {
        constructor(node?: SVGClipPathElement);
        constructor(attr: Object);
        node: SVGClipPathElement;

        targets(): List<Element>;
        remove(): this;
    }

    // container.js
    interface ViewBoxLike {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    class Container extends Element {
        circle(size?: NumberAlias): Circle;
        circle(size: number, unit: number): Circle;
        clip(): ClipPath;
        ellipse(width?: number, height?: number): Ellipse;
        flatten(parent: Dom, depth?: number): this;
        gradient(type: string, block?: (stop: Gradient) => void): Gradient;
        group(): G;
        image(): Image;
        image(href?: string, callback?: (e: Event) => void): Image;
        line(points?: PointArrayAlias): Line;
        line(x1: number, y1: number, x2: number, y2: number): Line;
        link(url: string): A;
        marker(width?: number, height?: number, block?: (marker: Marker) => void): Marker
        mask(): Mask;
        nested(): Svg;
        path(): Path;
        path(d: PathArrayAlias): Path;
        pattern(width?: number, height?: number, block?: (pattern: Pattern) => void): Pattern
        plain(text: string): Text;
        polygon(points?: PointArrayAlias): Polygon;
        polyline(points?: PointArrayAlias): Polyline;
        rect(width?: number, height?: number): Rect;
        text(block: (tspan: Tspan) => void): Text;
        text(text: string): Text;
        ungroup(parent: Dom, depth?: number): this;
        use(element: Element | string, file?: string): Use;
        viewbox(): Box;
        viewbox(viewbox: ViewBoxLike | string): this;
        viewbox(x: number, y: number, width: number, height: number): this;
        textPath(text: string | Text, path: string | Path): TextPath
        symbol(): Symbol
    }

    class Defs extends Container {
        constructor(node?: SVGDefsElement);
        node: SVGDefsElement;
        marker(width?: number, height?: number, block?: (marker: Marker) => void): Marker
    }

    class Svg extends Container {
        constructor(svgElement?: SVGSVGElement);
        constructor(id: string);
        node: SVGSVGElement;
        namespace(): this;
        defs(): Defs;
        remove(): this;
        isRoot(): boolean;
    }

    interface Sugar {
        fill(): any
        fill(fill: FillData): this;
        fill(color: string): this;
        fill(pattern: Element): this;
        fill(image: Image): this;
        stroke(): any;
        stroke(stroke: StrokeData): this;
        stroke(color: string): this;
        matrix(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number): this;
        matrix(mat: MatrixAlias, b?: number, c?: number, d?: number, e?: number, f?: number): this;
        rotate(degrees: number, cx?: number, cy?: number): this;
        skew(skewX?: number, skewY?: number, cx?: number, cy?: number): this;
        scale(scaleX?: number, scaleY?: number, cx?: number, cy?: number): this;
        translate(x: number, y: number): this;
        shear(lam: Matrix, cx: number, cy: number): this
        relative(x: number, y: number): this
        flip(direction?: string, around?: number): this
        flip(around: number): this
        opacity(): number
        opacity(value: number): this
        font(a: string): string
        font(a: string, v: string | number): this
        font(a: Object): this
    }

    // Symbol.js
    class Symbol extends Container {
        constructor(svgElement?: SVGSymbolElement);
        constructor(attr: Object)
        node: SVGSymbolElement;
    }

    class Element extends Dom implements Sugar {
        constructor(node?: SVGElement);
        constructor(attr: Object);
        node: HTMLElement | SVGElement;
        type: string;
        dom: any

        addClass(name: string): this;
        after(element: Element): Element;
        animate(duration?: number, ease?: string | ((pos: number) => number), delay?: number): Runner;
        animate(info: { ease?: string | ((pos: number) => number); duration?: number; delay?: number }): Runner;
        attr(): any;
        attr(name: string, value: any, namespace?: string): this;
        attr(name: string): any;
        attr(obj: string[]): Object;
        attr(obj: Object): this;
        back(): this;
        backward(): this;
        bbox(): Box;
        before(element: Element): Element;
        center(x: number, y: number): this;
        classes(): string[];
        click(cb: Function): this;
        clipper(): ClipPath;
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
        data(val: Object): this;
        dblclick(cb: Function): this;
        defs(): Defs;
        dmove(x: NumberAlias, y: NumberAlias): this;
        dx(x: NumberAlias): this;
        dy(y: NumberAlias): this;
        event(): Event | CustomEvent;
        fill(): any;
        fill(color: string): this;
        fill(fill: { color?: string; opacity?: number, rule?: string }): this;
        fill(image: Image): this;
        fill(pattern: Element): this;
        fire(event: Event): this;
        fire(event: string, data?: any): this;
        flip(a: string, offset?: number): this;
        flip(offset?: number): this;
        font(a: Object): this
        font(a: string, v: string | number): this
        font(a: string): string
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
        masker(): Mask
        maskWith(element: Element): this;
        maskWith(mask: Mask): this;
        matches(selector: string): boolean;
        matrix(): Matrix;
        matrix(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number): this;
        matrix(mat: MatrixAlias, b?: number, c?: number, d?: number, e?: number, f?: number): this;
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
        off(events?: string | Event[], cb?: EventListener | number): this;
        on(event: string, cb: Function, context?: Object): this;
        opacity(): number;
        opacity(o: number): this;
        relative(x: number, y: number): this
        shear(lam: Matrix, cx: number, cy: number): this
        toRoot(): Svg;
        /**
         * By default parents will return a list of element up until html Document.
         */
        parents(): List<Element>
        /**
         * List the parent by hierarchy until the given parent type or object. If the given value is null
         * then the result is only provided the list up until Svg root element which mean no Dom parent element is included.
         * @param util a parent type
         */
        parents<T extends Dom>(util: string | null | T | HTMLElement): List<Element>
        /**
         * Get reference svg element based on the given attribute.
         * @param attr a svg attribute
         */
        reference<R extends Dom>(attr: AttributeReference): R | null

        point(): Point;
        point(position: CoordinateXY): Point;
        point(point: Point): Point;
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
        root(): Svg;
        rotate(d: number, cx?: number, cy?: number): this;
        scale(x?: number, y?: number, cx?: number, cy?: number): this;
        screenCTM(): Matrix;
        setData(data: object): this;
        show(): this;
        show(): this;
        size(width?: NumberAlias, height?: NumberAlias): this;
        skew(x?: number, y?: number, cx?: number, cy?: number): this;
        stop(jumpToEnd: boolean, clearQueue: boolean): Animation;
        stop(offset?: NumberAlias | string, color?: NumberAlias, opacity?: NumberAlias): Stop;
        stop(val: { offset?: NumberAlias | string, color?: NumberAlias, opacity?: NumberAlias }): Stop;
        stroke(): any;
        stroke(color: string): this;
        stroke(stroke: StrokeData): this;
        timeline(): Timeline
        timeline(tl: Timeline): this
        toggleClass(name: string): this;
        toParent(parent: Dom): this;
        toSvg(): this;
        touchcancel(cb: Function): this;
        touchend(cb: Function): this;
        touchleave(cb: Function): this;
        touchmove(cb: Function): this;
        touchstart(cb: Function): this;
        transform(): MatrixExtract;
        transform(t: MatrixAlias, relative?: boolean): this;
        translate(x: number, y: number): this;
        unclip(): this;
        unmask(): this;
        untransform(): this;
        visible(): boolean;
        width(): number;
        width(width: NumberAlias): this;
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
        constructor(node?: SVGCircleElement);
        constructor(attr: Object);
        node: SVGCircleElement;

        rx(rx: number): this;
        rx(): this;
        ry(ry: number): this;
        ry(): this;
        radius(x: number, y?: number): this;
    }
    class Ellipse extends Shape implements CircleMethods {
        node: SVGEllipseElement;
        constructor(node?: SVGEllipseElement);
        constructor(attr: Object);

        rx(rx: number): this;
        rx(): this;
        ry(ry: number): this;
        ry(): this;
        radius(x: number, y?: number): this;
    }

    interface StopProperties {
        color?: ColorAlias;
        offset?: number | string;
        opacity?: number;
    }

    // gradient.js
    class Stop extends Element {
        update(offset?: number, color?: ColorAlias, opacity?: number): this;
        update(opts: StopProperties): this;
    }
    class Gradient extends Container {
        constructor(node?: SVGGradientElement);
        constructor(attr: Object);
        constructor(type: string);
        node: SVGGradientElement;

        at(offset?: number, color?: ColorAlias, opacity?: number): Stop;
        at(opts: StopProperties): Stop;
        url(): string;
        url(...params: any[]): never;
        toString(): string;
        from(x: number, y: number): this;
        to(x: number, y: number): this;
        radius(x: number, y?: number): this;
        targets(): List<Element>
        bbox(): Box
        update(block?: (gradient: Gradient) => void): this;
    }

    // group.js
    class G extends Container {
        constructor(node?: SVGGElement);
        constructor(attr: Object);
        node: SVGGElement;
        gbox(): Box;
    }

    // hyperlink.js
    class A extends Container {
        constructor(node?: SVGAElement);
        constructor(attr: Object);
        node: SVGAElement;
        to(url: string): this;
        to(): string;
        target(target: string): this;
        target(): string;
    }

    // image.js
    class Image extends Shape {
        constructor(node?: SVGImageElement);
        constructor(attr: Object);
        node: SVGImageElement;
        load(url?: string): this;
    }

    // line.js
    type PointArrayAlias = number[] | ArrayXY[] | PointArray | string;

    class Line extends Shape {
        constructor(node?: SVGLineElement);
        constructor(attr: Object);
        node: SVGLineElement;
        array(): PointArray;
        plot(): PathArray
        plot(points?: PointArrayAlias): this;
        plot(x1: number, y1: number, x2: number, y2: number): this;
        move(x: number, y: number): this;
        size(width?: number, height?: number): this;
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => void): Marker;
        marker(position: string, marker: Marker): Marker;
    }

    // marker.js
    class Marker extends Container {
        ref(x: string | number, y: string | number): this;
        update(block: (marker: Marker) => void): this;
        toString(): string;
    }
    // mask.js
    class Mask extends Container {
        constructor(node?: SVGMaskElement);
        constructor(attr: Object);
        node: SVGMaskElement;
        remove(): this
        targets(): List<Element>;
    }

    // path.js
    class Path extends Shape {
        constructor(node?: SVGPathElement);
        constructor(attr: Object);
        /**
         * DO NOT USE, it only for testing purpose
         */
        _array: PathArray

        node: SVGPathElement;

        morphArray: PathArray;
        array(): PathArray;
        plot(): PathArray;
        plot(d: PathArrayAlias): this;
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => void): Marker;
        marker(position: string, marker: Marker): Marker;
        length(): number;
        pointAt(length: number): { x: number, y: number };
        text(text: string): TextPath
        text(text: Text): TextPath
        targets(): List<Element>

    }

    // pattern.js
    class Pattern extends Container {
        url(): string;
        url(...rest: any[]): never;
        update(block: (pattern: Pattern) => void): this;
        toString(): string;
    }

    // poly.js
    interface poly {
        /**
         * DO NOT USE THIS, it for test purpose only
         */
        _array: PointArray

        array(): PointArray;
        plot(): PointArray
        plot(p: PointArrayAlias): this;
        clear(): this;
        move(x: NumberAlias, y: NumberAlias): this;
        size(width: number, height?: number): this;
    }

    // pointed.js
    interface pointed {
        x(): number
        x(x: number): this
        y(): number
        y(y: number): this
        height(): number
        height(h: number): this
        width(): number
        width(w: number): this
    }

    class Polyline extends Shape implements poly, pointed {
        constructor(node?: SVGPolylineElement);
        constructor(attr: Object);
        node: SVGPolylineElement;
        _array: PointArray

        array(): PointArray;
        plot(): PointArray
        plot(p: PointArrayAlias): this;
        move(x: number, y: number): this;
        size(width: number, height?: number): this;
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => void): Marker;
        marker(position: string, marker: Marker): Marker;
    }

    class Polygon extends Shape implements poly {
        constructor(node?: SVGPolygonElement);
        constructor(attr: Object);
        node: SVGPolygonElement;
        _array: PointArray;
        array(): PointArray;
        plot(): PointArray;
        plot(p: PointArrayAlias): this;
        move(x: number, y: number): this;
        size(width: number, height?: number): this;
        marker(position: string, width?: number, height?: number, block?: (marker: Marker) => void): Marker;
        marker(position: string, marker: Marker): Marker;
    }

    class Rect extends Shape {
        constructor(node?: SVGRectElement);
        constructor(attr: Object);
        node: SVGRectElement;
        radius(x: number, y?: number): this;
    }

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

    interface FillData {
        color?: string
        opacity?: number
        rule?: string
    }

    interface FontData {
        family?: string;
        size?: NumberAlias;
        anchor?: string;
        leading?: NumberAlias;
        weight?: string;
        style?: string
    }
    // textable.js
    interface Textable {
        plain(text: string): this;
        length(): number;
    }

    // text.js
    class Text extends Shape implements Textable {
        constructor(node?: SVGElement);
        constructor(attr: Object);
        // for the purpose of testing only
        _rebuild: boolean
        _build: boolean

        clone(): this;
        text(): string;
        text(text: string): this;
        text(block: (text: this) => void): this;
        leading(): Number;
        leading(leading: NumberAlias): this;
        rebuild(enabled: boolean): this;
        build(enabled: boolean): this;
        plain(text: string): this;
        tspan(text: string): Tspan;
        tspan(block: (tspan: Tspan) => void): this;
        clear(): this;
        length(): number;
        get(i: number): Tspan;
        path(): TextPath
        path(d: PathArrayAlias | Path): TextPath;
        track(): Element;
        textPath(): Element;
        ax(): string
        ax(x: string): this
        ay(): string
        ay(y: string): this
        amove(x: number, y: number): this
    }

    class Tspan extends Shape implements Textable {
        constructor(node?: SVGElement);
        constructor(attr: Object);
        dx(): number;
        dx(x: NumberAlias): this;
        dy(): number;
        dy(y: NumberAlias): this;
        newLine(): this;
        tspan(text: string): Tspan;
        tspan(block: (tspan: Tspan) => void): this;
        length(): number;
        text(): string;
        text(text: string): this;
        plain(text: string): this;
    }

    // textpath.js
    class TextPath extends Text {
        constructor();
        array(): Array<any>
        plot(): PathArray
        plot(d: string): this
        track(): Path
    }

    // use.js
    class Use extends Shape {
        element(element: string, file?: string): this;
    }

    // viewbox.js
    type ViewBoxAlias = ViewBoxLike | number[] | string | Element;

    interface ViewBox {
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
}
