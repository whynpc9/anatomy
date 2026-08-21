#!/bin/bash
# Chunked resumable download for flaky hosts that stall mid-transfer:
# fetch in fixed-size ranges with per-chunk retries, then concatenate.
# Usage: chunked-dl.sh <url> <output> [chunk_bytes=393216]
set -u
url="$1"; out="$2"; chunk="${3:-393216}"
tmp="${out}.chunks"
mkdir -p "$tmp"

total=$(curl -sI --max-time 30 "$url" | tr -d '\r' | awk 'tolower($1)=="content-length:"{print $2}' | tail -1)
if [ -z "${total:-}" ]; then echo "no content-length for $url" >&2; exit 1; fi
echo "total=$total chunk=$chunk"

n=$(( (total + chunk - 1) / chunk ))
for ((i=0; i<n; i++)); do
  start=$((i * chunk))
  end=$((start + chunk - 1))
  [ $end -ge $total ] && end=$((total - 1))
  part=$(printf "%s/part-%05d" "$tmp" "$i")
  want=$((end - start + 1))
  have=0
  [ -f "$part" ] && have=$(wc -c < "$part" | tr -d ' ')
  if [ "$have" -eq "$want" ]; then continue; fi
  ok=0
  for try in 1 2 3 4 5 6; do
    curl -sL --http1.1 --max-time 120 -r "$start-$end" -o "$part" "$url"
    rc=$?
    have=0
    [ -f "$part" ] && have=$(wc -c < "$part" | tr -d ' ')
    if [ $rc -eq 0 ] && [ "$have" -eq "$want" ]; then ok=1; break; fi
    sleep 1
  done
  if [ $ok -ne 1 ]; then echo "chunk $i FAILED (want $want have $have)" >&2; exit 2; fi
  echo "chunk $i/$((n-1)) ok"
done

cat "$tmp"/part-* > "$out"
size=$(wc -c < "$out" | tr -d ' ')
if [ "$size" -eq "$total" ]; then
  rm -rf "$tmp"
  echo "DONE $out ($size bytes)"
else
  echo "SIZE MISMATCH want $total have $size" >&2
  exit 3
fi
