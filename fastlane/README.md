fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios build

```sh
[bundle exec] fastlane ios build
```

Submit a new Build to Apple TestFlight

### ios beta

```sh
[bundle exec] fastlane ios beta
```



### ios pro

```sh
[bundle exec] fastlane ios pro
```



----


## Android

### android bump_build_number

```sh
[bundle exec] fastlane android bump_build_number
```

Increments internal build number tracking (different than version)

### android playstoreInternal

```sh
[bundle exec] fastlane android playstoreInternal
```

Build and uploads the app to playstore for a internal testing release

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
