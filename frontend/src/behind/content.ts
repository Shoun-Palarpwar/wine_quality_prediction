export const chapters = [
  ["question", "The question"],
  ["method", "The method"],
  ["models", "The models"],
  ["evidence", "The evidence"],
  ["creation", "The creation"],
];
export const pipeline = [
  {
    title: "Observe",
    tag: "01 / DATA",
    text: "Start with 1,599 red-wine records from the UCI Wine Quality collection. Eleven physicochemical measurements form X; the sensory quality score is the target y. The observed labels are 3–8 on the original 0–10 scale.",
    detail:
      "Acidity, sugar, chlorides, sulphur dioxide, density, pH, sulphates and alcohol.",
    file: "data/raw/winequality-red.csv",
  },
  {
    title: "Clean",
    tag: "02 / INTEGRITY",
    text: "Validate the feature schema, numeric values and labels. Remove 240 duplicate rows before splitting, leaving 1,359 unique records. This prevents identical records from appearing on both sides of the evaluation.",
    detail:
      "No synthetic oversampling, scaling or imputation is applied by this pipeline.",
    file: "wine_quality/data.py → clean_data()",
  },
  {
    title: "Hold out",
    tag: "03 / EXPERIMENT DESIGN",
    text: "Reserve 20% of the cleaned data for testing. A stratified split preserves the label proportions: 1,087 training samples and 272 held-out samples. The random seed is fixed at 42.",
    detail:
      "The test set does not choose the winning model or its hyperparameters.",
    file: "wine_quality/data.py → split_data()",
  },
  {
    title: "Compare",
    tag: "04 / LEARNING",
    text: "Compare a majority-class dummy, baseline forest, class-balanced forest and forest regressor. Use the same five stratified training folds for all candidates. Macro F1 gives each quality class equal weight.",
    detail:
      "Regression predictions are rounded and clipped to 3–8 for classification metrics.",
    file: "wine_quality/training.py → train_models()",
  },
  {
    title: "Tune",
    tag: "05 / SEARCH",
    text: "GridSearchCV explores 16 combinations of tree count, maximum depth, minimum leaf size and class weighting. Five folds produce 80 candidate-fold fits, followed by a refit of the best configuration.",
    detail:
      "Selected: 400 trees, balanced class weights, no maximum depth, minimum leaf size 1.",
    file: "reports/tables/best_hyperparameters.csv",
  },
  {
    title: "Evaluate",
    tag: "06 / EVIDENCE",
    text: "Evaluate the saved candidates on the held-out set. Accuracy measures exact matches; macro F1 and balanced accuracy expose minority-class performance. MAE, within-one-point accuracy and weighted kappa reflect score ordering.",
    detail:
      "One fixed split is evidence about this experiment, not a universal performance guarantee.",
    file: "wine_quality/evaluation.py → evaluate_models()",
  },
  {
    title: "Experience",
    tag: "07 / APPLICATION",
    text: "Save the selected estimator with joblib. A local Python API validates eleven measurements and runs inference. React turns the result into the Cantina experience, with probabilities, warnings and a downloadable report.",
    detail:
      "The interface calls the actual saved model. Decorative fermentation does not train it.",
    file: "wine_quality/api.py → frontend/src/lib/api.ts",
  },
];
export const modelNotes: Record<
  string,
  {
    name: string;
    subtitle: string;
    theory: string;
    approach: string;
    caveat: string;
  }
> = {
  dummy: {
    name: "The sanity check",
    subtitle: "Most-frequent DummyClassifier",
    theory:
      "Always predict the most common training class. It ignores chemistry entirely, establishing the minimum that a learned model should improve upon.",
    approach: "strategy = most_frequent",
    caveat:
      "Its 42.6% test accuracy demonstrates why accuracy alone can flatter an imbalanced problem.",
  },
  baseline: {
    name: "A forest of decisions",
    subtitle: "Random Forest · baseline",
    theory:
      "A decision tree partitions chemical measurements with threshold rules. A forest trains many trees on bootstrap samples, with random feature subsets at each split. The classifier averages tree class probabilities and chooses the largest.",
    approach: "200 trees · random seed 42",
    caveat:
      "Nonlinear interactions are captured without feature standardization, but rare labels remain difficult.",
  },
  balanced: {
    name: "Give rare vintages a voice",
    subtitle: "Random Forest · class weighted",
    theory:
      "The same ensemble architecture, with inverse-frequency class weights. Rare classes contribute more strongly to the split objective, rather than being overwhelmed by scores 5 and 6.",
    approach: "weight(c) = N / (K × count(c))",
    caveat:
      "Weighting changes the learning objective; it does not create more independent rare-class examples.",
  },
  regression: {
    name: "Respect the order",
    subtitle: "Random Forest · regression",
    theory:
      "Each regression tree predicts a numeric score and the forest averages those predictions. Squared-error fitting treats scores as ordered quantities. This experiment rounds and clips the result for comparison with classifiers.",
    approach: "ŷ = mean(tree predictions) → round → clip(3, 8)",
    caveat:
      "Rounding loses fine detail; the equal spacing of sensory scores is an assumption.",
  },
  tuned: {
    name: "The selected vintage",
    subtitle: "Random Forest · GridSearchCV",
    theory:
      "A systematic search varies four hyperparameters. The configuration with the highest mean training-fold macro F1 is refitted on all training data and saved as the selected model.",
    approach: "16 configurations × 5 folds · macro F1 selection",
    caveat:
      "The search score is optimistic as a generalization estimate. The held-out test supplies a separate evaluation.",
  },
};
export const milestones = [
  [
    "01",
    "A question in a dataset",
    "Can objective chemistry help estimate subjective wine quality? The starting point was a supervised-learning experiment, with quality as the target and laboratory measurements as the inputs.",
  ],
  [
    "02",
    "Scripts become a pipeline",
    "The original numbered scripts are preserved in archive/original_run. The current package separates cleaning, exploration, training, evaluation and prediction, with repeatable commands and validation tests.",
  ],
  [
    "03",
    "Evidence before aesthetics",
    "Duplicate removal, stratified validation, a dummy benchmark and multiple metrics make the experiment easier to defend. Current reports are kept separate from the archived first run.",
  ],
  [
    "04",
    "From model to Cantina",
    "A local API connects the saved estimator to a React interface. The cellar, analysis lab and intelligence pages translate chemical measurements and research artifacts into an interactive product.",
  ],
  [
    "05",
    "An experiment in immersion",
    "The fourth tab explores a rotating bottle as the interface: composition, fermentation and a rating reveal on its labels. This is an interface prototype; its visual polish remains an area for iteration.",
  ],
  [
    "06",
    "The project explains itself",
    "Behind Cantina brings the question, theory, implementation and actual evidence into one academic presentation. The next useful work is better validation, probability calibration and a more refined visual experience.",
  ],
];
