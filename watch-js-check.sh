#! /bin/sh

# aptitude install inotify-tools
# npm install jshint

# without -e flag: skip jshint errors

echo 'jschecking...'

CHNG=''

while true; do

	# format - path + filename, like src/asdf/wer.js
	CHNG=$(inotifywait -q --format='%w%f'  --exclude='(html|css)$' -r -e close_write src/)

	echo $CHNG 'jslinting...'

    # or jshint
	eslint $CHNG
	#--exclude=src/**/*.spec.js src/**/*.js
	
	echo 'jshinted'
done
