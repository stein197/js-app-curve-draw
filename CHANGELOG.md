# CHANGELOG
## [Unreleased]
- Split the code into modules
- Simplify bezier calculations by removing redundant factorials (see building animation)
- Add animation to show how the curve is being built
	- Add memoization to `bezier.create()` when animate building
- Automatically detect the necessary amout of sumdivisions instead of using `config.BEZIER_SEGMENT_QUALITY`

## [0.1.0](../../tree/0.1.0) - 2022-07-23
Release
