const useCoverage = !!process.env.GENERATE_JEST_REPORT;

export default {
  notify: true,
  verbose: true,
  testPathIgnorePatterns: ['./dist/__tests__'],
  snapshotSerializers: ['jest-serializer-path'],
  collectCoverageFrom: ['./src/**/*.ts', '!./src/__tests__/'],
  reporters: process.env.CI
    ? [['jest-silent-reporter', { useDots: true }]].concat(
        useCoverage ? ['jest-junit'] : []
      )
    : ['default'].concat(useCoverage ? ['jest-junit'] : []),
  transform: { '\\.[t]sx?$': 'ts-jest' },
  moduleFileExtensions: ['js', 'ts', 'json']
};
