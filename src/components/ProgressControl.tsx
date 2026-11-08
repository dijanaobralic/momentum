import { Pressable, StyleSheet, Text, View } from "react-native";

import { useType } from "../fonts";
import { bumpCount, fraction, isDone, progressLabel, tapStep } from "../lib";
import { areaColors, colors } from "../theme";
import type { Area, Progress } from "../types";

interface Props {
  title: string;
  area: Area;
  progress: Progress;
  onChange: (progress: Progress) => void;
}

/** One control per progress kind: +/− for counts, tappable quarters for fuzzy tasks, a single bar for yes/no. */
export function ProgressControl({ title, area, progress, onChange }: Props) {
  const type = useType();
  const palette = areaColors[area];
  const label = progressLabel(progress);
  const done = isDone(progress);

  return (
    <View style={styles.pc}>
      <View style={styles.head}>
        <Text style={[styles.title, { fontFamily: type.body }, done && styles.done]}>{title}</Text>
        <Text style={[styles.label, { fontFamily: type.bodySemibold, color: palette.text }]}>{label}</Text>
      </View>

      {progress.kind === "count" && (
        <View style={styles.countRow}>
          <View style={[styles.track, { backgroundColor: palette.soft }]} accessibilityElementsHidden>
            <View style={[styles.fill, { width: `${fraction(progress) * 100}%`, backgroundColor: palette.fill }]} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Less ${title}`}
            onPress={() => onChange(bumpCount(progress, -1))}
            style={styles.iconBtn}
          >
            <Text style={[styles.iconBtnText, { fontFamily: type.body }]}>−</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`More ${title}`}
            onPress={() => onChange(bumpCount(progress, 1))}
            style={styles.iconBtn}
          >
            <Text style={[styles.iconBtnText, { fontFamily: type.body }]}>+</Text>
          </Pressable>
        </View>
      )}

      {progress.kind === "steps" && (
        <View style={styles.segs} accessibilityLabel={`${title} progress`}>
          {[1, 2, 3, 4].map((n) => {
            const on = n <= progress.value;
            return (
              <Pressable
                key={n}
                accessibilityRole="button"
                accessibilityLabel={`Set ${title} to ${n * 25}%`}
                accessibilityState={{ selected: on }}
                onPress={() => onChange({ kind: "steps", value: tapStep(progress.value, n) })}
                hitSlop={{ top: 18, bottom: 18 }}
                style={[styles.seg, { backgroundColor: on ? palette.fill : palette.soft }]}
              />
            );
          })}
        </View>
      )}

      {progress.kind === "binary" && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mark ${title} ${progress.done ? "not done" : "done"}`}
          accessibilityState={{ selected: progress.done }}
          onPress={() => onChange({ kind: "binary", done: !progress.done })}
          hitSlop={{ top: 18, bottom: 18 }}
          style={[styles.binary, { backgroundColor: progress.done ? palette.fill : palette.soft }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pc: { gap: 8 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 12 },
  title: { flex: 1, fontSize: 15, color: colors.ink },
  done: { textDecorationLine: "line-through", color: colors.muted },
  label: { fontSize: 12 },
  countRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  track: { flex: 1, height: 8, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: { fontSize: 22, lineHeight: 26, color: colors.ink },
  segs: { flexDirection: "row", gap: 4 },
  seg: { flex: 1, height: 8, borderRadius: 999 },
  // `flex: 0` is shorthand for a 0% basis, which collapses this bar's height in a column.
  binary: { width: "100%", height: 8, borderRadius: 999, flexGrow: 0, flexShrink: 0 },
});
