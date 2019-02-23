describe('timeline', function() {
    describe('getEndTimeOfTimeline', function() {
        it('returns 0 if no runners are scheduled', function() {
            const timeline = new SVG.Timeline();
            endTime = timeline.getEndTimeOfTimeline();
            expect(endTime).toEqual(0);
        })
    })

    describe('finish - issue #964', function() {
        beforeEach(function() {
            draw.clear()
            draw.attr('viewBox', null)
        })

        it('places all elements at the right position - single runner', function() {
            const timeline = new SVG.Timeline()

            const rect = draw.rect(20,20)
            rect.timeline(timeline)
            rect.animate().move(100, 200)

            timeline.finish()
            expect(rect.x()).toEqual(100);
            expect(rect.y()).toEqual(200);
        })

        it('places all elements at the right position - runner that finishes latest is in first position', function() {
            const timeline = new SVG.Timeline()

            const rect1 = draw.rect(10, 10)
            rect1.timeline(timeline)
            
            const rect2 = draw.rect(10, 10)
            rect2.timeline(timeline);

            const rect3 = draw.rect(10, 10)
            rect3.timeline(timeline);

            rect1.animate(2000, 0, 'now').move(100, 200)
            rect2.animate(1000, 0, 'now').move(100, 200)
            rect3.animate(1000, 500, 'now').move(100, 200)

            timeline.finish()

            expect(rect1.x()).toEqual(100);
            expect(rect1.y()).toEqual(200);

            expect(rect2.x()).toEqual(100);
            expect(rect2.y()).toEqual(200);

            expect(rect3.x()).toEqual(100);
            expect(rect3.y()).toEqual(200);
        })

        it('places all elements at the right position - runner that finishes latest is in middle position', function() {
            const timeline = new SVG.Timeline()

            const rect1 = draw.rect(10, 10)
            rect1.timeline(timeline)
            
            const rect2 = draw.rect(10, 10)
            rect2.timeline(timeline);

            const rect3 = draw.rect(10, 10)
            rect3.timeline(timeline);

            rect2.animate(1000, 0, 'now').move(100, 200)
            rect1.animate(2000, 0, 'now').move(100, 200)
            rect3.animate(1000, 500, 'now').move(100, 200)

            timeline.finish()

            expect(rect1.x()).toEqual(100);
            expect(rect1.y()).toEqual(200);

            expect(rect2.x()).toEqual(100);
            expect(rect2.y()).toEqual(200);

            expect(rect3.x()).toEqual(100);
            expect(rect3.y()).toEqual(200);
        })

        it('places all elements at the right position - runner that finishes latest is in last position', function() {
            const timeline = new SVG.Timeline()

            const rect1 = draw.rect(10, 10)
            rect1.timeline(timeline)
            
            const rect2 = draw.rect(10, 10)
            rect2.timeline(timeline);

            const rect3 = draw.rect(10, 10)
            rect3.timeline(timeline);

            rect2.animate(1000, 0, 'now').move(100, 200)
            rect3.animate(1000, 500, 'now').move(100, 200)
            rect1.animate(2000, 0, 'now').move(100, 200)

            timeline.finish()

            expect(rect1.x()).toEqual(100);
            expect(rect1.y()).toEqual(200);

            expect(rect2.x()).toEqual(100);
            expect(rect2.y()).toEqual(200);

            expect(rect3.x()).toEqual(100);
            expect(rect3.y()).toEqual(200);
        })
    })    
})