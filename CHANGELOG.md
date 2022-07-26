# CHANGELOG
## [Unreleased]
- [x] Split the code into modules
- [x] Simplify bezier calculations by removing redundant factorials (see building animation)
- [x] Cache bezier points so it won't be recalculated on `window.resize` event
- [ ] Add animation to show how the curve is being built
	- [ ] Add memoization to `bezier.create()` when animate building
- [ ] Automatically detect the necessary amount of subdivisions instead of using `config.BEZIER_SEGMENT_QUALITY`

## [0.1.0](../../tree/0.1.0) - 2022-07-23
Release
