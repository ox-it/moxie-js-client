# Makefile to build the application for PhoneGap Build
# Produces a zip file that can be uploaded to build.phonegap.com
# Just run `make`
# Requires: r.js, sass

TARGET_FOLDER = phonegap_build

build:
	@echo "=> Cleaning..."
	@rm -rf $(TARGET_FOLDER)
	@rm $(TARGET_FOLDER).zip
	@mkdir $(TARGET_FOLDER)
	@echo "=> Copying files"
	@cp index-phonegap.html $(TARGET_FOLDER)/index.html
	@cp config.xml $(TARGET_FOLDER)/config.xml
	@cp -R images $(TARGET_FOLDER)
	@cp -R webfonts $(TARGET_FOLDER)
	@echo "=> JS build"
	@r.js -o app/moxie.build.js
	@cp app/main-built.js $(TARGET_FOLDER)/app.js
	@echo "=> CSS build"
	@compass compile
	@cp css/app.css $(TARGET_FOLDER)/app.css
	@echo "=> ZIPping..."
	@zip -r $(TARGET_FOLDER) $(TARGET_FOLDER)

all: build