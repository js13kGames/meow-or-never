#!/usr/bin/env bash
while read -r
do
	# Collect referenced scripts.
	[[ $REPLY == *\<script\ src=* ]] && {
		SRC=${REPLY#*src=\"}
		SRC=${SRC%%\"*}
		[ -r "$SRC" ] && {
			SCRIPTS=$SCRIPTS${SCRIPTS:+ }$SRC
			continue
		}
	}
	# Embed scripts.
	[ "$SCRIPTS" ] && {
		echo -n '<script>'
		cat <<EOF | esbuild --minify
"use strict"
$(cat $SCRIPTS | sed "s/['\"]use strict['\"]//")
EOF
		echo -n '</script>'
		SCRIPTS=
	}
	# Remove indent.
	REPLY=${REPLY##*$'\t'}
	# Remove empty lines.
	[ "$REPLY" ] || continue
	# Keep preprocessor statements on a line.
	[[ $REPLY == \#* ]] && {
		echo "$REPLY"
		continue
	}
	echo -n "$REPLY" |
		# Remove blanks.
		sed '
s/\([CLM]\) /\1/g;
s/ {/{/g;
s/, /,/g;
s/: /:/g;
s/; /;/g;
s/;"/"/g;
s/<!--.*-->//g'
done
