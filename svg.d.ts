interface SVGJSTransformObj{
    x?: number;
    y?: number;

    rotation?: number;
    cx?: number;
    cy?: number;

    scaleX?: number;
    scaleY?: number;

    skewX?: number;
    skewY?: number;

    matrix?: string;
    a?: number;
    b: number;
    c?: number;
    d?: number;
    e?: number;
    f?: number;
}
interface SVGJSBBox{
    height: number;
    width: number;
    y: number;
    x: number;
    cx: number;
    cy: number;
    merge(box:SVGJSBBox): SVGJSBBox;
}

interface SVGJSAnimation{
    attr(multipleAttributes: any): SVGJSAnimation;
    attr(attributeName: string): any;
    attr(attributeName: string, value: any, namespace?: string): SVGJSAnimation;
    move(x: number, y: number): SVGJSAnimation;
    center(x: number, y: number): SVGJSAnimation;
    after(callback: () => void ): SVGJSAnimation;
}

interface SVGJSMaskInstance{
    add(mask: SVGJSElementInstance): SVGJSMaskInstance;
    remove();
}
interface SVGJSElementInstance {
    size(w: number, h: number): SVGJSElementInstance;
    attr(multipleAttributes: any): SVGJSElementInstance;
    attr(attributeName: string): any;
    attr(attributeName: string, value: any, namespace?: string): SVGJSElementInstance;

    transform(key: string, value: any): SVGJSElementInstance;
    transform(transformObj: SVGJSTransformObj): SVGJSElementInstance;

    style(cssName: string, cssValue: string): SVGJSElementInstance;
    style(cssStyle: string): SVGJSElementInstance;
    style(styleObject: CSSRule): SVGJSElementInstance;
    style(cssName?: string): string;

    move(x: number, y: number): SVGJSElementInstance;
    x(value: number): SVGJSElementInstance;
    y(value: number): SVGJSElementInstance;

    center(x: number, y: number): SVGJSElementInstance;
    cx(value: number): SVGJSElementInstance;
    cy(value: number): SVGJSElementInstance;

    remove(): void;

    bbox(): SVGJSBBox;
    rbox(): SVGJSBBox;

    animate(): SVGJSAnimation;
    animate(millisec: number, ease: string, delay: number): SVGJSAnimation;
    animate(settings: { millisec?: number; ease?: string; delay?: number; }): SVGJSAnimation;
    stop(): void;

    fill(settings: { color?: string; opacity?: number; }): SVGJSElementInstance;
    fill(color: string): SVGJSElementInstance;

    stroke(settings: { color?: string; opacity?: number; width?: number; }): SVGJSElementInstance;
    stroke(color: string): SVGJSElementInstance;

    opacity(value: number): SVGJSElementInstance;
    rotate(degrees: number): SVGJSElementInstance;
    rotate(degrees: number, cx:number, cy:number): SVGJSElementInstance;

    skew(x: number, y: number): SVGJSElementInstance;
    translate(x: number, y: number): SVGJSElementInstance;
    maskWith(anotherElement: SVGJSElementInstance): void;
    mask(): SVGJSMaskInstance;
    mask: SVGJSMaskInstance;

    clipWith(anotherElement: SVGJSElementInstance): void;
    front(): SVGJSElementInstance;
    back(): SVGJSElementInstance;
    foreward(): SVGJSElementInstance;
    backward(): SVGJSElementInstance;
    siblings(): SVGJSElementInstance[];
    previous(): SVGJSElementInstance;
    before(SVGJSElementInstance): SVGJSElementInstance;
    after(SVGJSElementInstance): SVGJSElementInstance;

    click(fn: () => void ): SVGJSElementInstance;
    dblclick(fn: () => void ): SVGJSElementInstance;
    mousedown(fn: () => void ): SVGJSElementInstance;
    mouseup(fn: () => void ): SVGJSElementInstance;
    mouseover(fn: () => void ): SVGJSElementInstance;
    mouseout(fn: () => void ): SVGJSElementInstance;
    mousemove(fn: () => void ): SVGJSElementInstance;
    mouseenter(fn: () => void ): SVGJSElementInstance;
    mouseleave(fn: () => void ): SVGJSElementInstance;
    touchstart(fn: () => void ): SVGJSElementInstance;
    touchend(fn: () => void ): SVGJSElementInstance;
    touchmove(fn: () => void ): SVGJSElementInstance;
    touchcancel(fn: () => void ): SVGJSElementInstance;
    on(eventName: string, handler: () => void ): SVGJSElementInstance;
    off(eventName: string, handler: () => void ): SVGJSElementInstance;

    data(key: string, value: any, donotConvertToJson?:bool): SVGJSElementInstance;
    data(key: string): any;
}

interface SVGJSTextElementInstance extends SVGJSElementInstance {
    content: string;
}

interface SVGJSViewBox{
    x: number;
    y: number;
    zoom: number;
    height: number;
    width: number;
}

interface SVGJSInstance {
    size(w: number, h: number): SVGJSInstance;
    attr(multipleAttributes: any): SVGJSInstance;
    attr(attributeName: string): any;
    attr(attributeName: string, value: any, namespace?: string): SVGJSInstance;

    viewbox(x: number, y: number, width: number, height: number): SVGJSInstance;
    viewbox(settings: { x: number; y: number; width: number; height: number; }): SVGJSInstance;
    viewbox(): SVGJSViewBox;

    nested(): SVGJSInstance;
    rect(width: number, height: number): SVGJSElementInstance;
    ellipse(width: number, height: number): SVGJSElementInstance;
    circle(radius: number): SVGJSElementInstance;
    line(x1: number, y1: number, x2: number, y2: number): SVGJSElementInstance;
    polyline(config: string): SVGJSElementInstance;
    polyline(points: number[][]): SVGJSElementInstance;
    polygon(config: string): SVGJSElementInstance;
    path(config: string): SVGJSElementInstance;
    image(path: string, width: number, height: number); SVGJSElementInstance;
    text(text: string): SVGJSTextElementInstance;
    get (id: string): SVGJSElementInstance;

    clear(): void;
    children(): SVGJSElementInstance[];

    each(iterator: (i: number, child: SVGJSElementInstance) => void ): void;

    group(): SVGJSGroup;
    gradient(type: string, block: (stop: SVGJSStop) => void ): SVGJSGradient;

    pattern(width: number, height: number, block: (add: SVGJSPattern) => void ): SVGJSPattern;
}

interface SVGJSGradient{
    from(x: number, y: number): SVGJSGradient;
    to(x: number, y: number): SVGJSGradient;
    update(fn: (stop: SVGJSStop) => void ): SVGJSGradient;
}

interface SVGJSStop{
    at(arg: { offset: number; color: string; opacity: number; }): SVGJSStop;
    update(arg: { offset: number; color: string; opacity: number; }): SVGJSStop;
}

interface SVGJSPattern extends SVGJSInstance {
}
interface SVGJSGroup extends SVGJSInstance, SVGJSElementInstance{
}

interface SVGJSStatic{
    (id: string): SVGJSInstance;
    (element: HTMLElement): SVGJSInstance;
}

declare var SVG : SVGJSStatic;
