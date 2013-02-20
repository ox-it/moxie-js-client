# Makefile to build the application for PhoneGap Build
# Produces a zip file that can be uploaded to build.phonegap.com
# Just run `make`
# Requires: r.js, sass

TARGET_FOLDER = phonegap_build

package:
	@echo "=> Cleaning..."
	@rm -rf $(TARGET_FOLDER)
	@rm -f $(TARGET_FOLDER).zip
	@mkdir $(TARGET_FOLDER)
	@echo "=> Copying files"
	@cp index-phonegap.html $(TARGET_FOLDER)/index.html
	@cp config.xml $(TARGET_FOLDER)/config.xml
	@cp images/mobile-oxford-logo.png $(TARGET_FOLDER)/mobile-oxford-logo.png   # has to be at the root of the package
	@cp images/mobile-oxford-splash.png $(TARGET_FOLDER)/mobile-oxford-splash.png   # has to be at the root of the package
	@cp -R images $(TARGET_FOLDER)
	@cp -R webfonts $(TARGET_FOLDER)
	@echo "=> JS build"
	@r.js -o app/moxie.build.js
	@cp app/main-built.js $(TARGET_FOLDER)/app.js
	@echo "=> CSS build"
	@compass compile
	@cp -R css $(TARGET_FOLDER)
	@echo "=> ZIPping..."
	@zip -r $(TARGET_FOLDER) $(TARGET_FOLDER)

all: package
