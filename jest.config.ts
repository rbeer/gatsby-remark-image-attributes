const useCoverage = !!process.env.GENERATE_JEST_REPORT;

export default {
  notify: true,
  verbose: true,
  roots: ['./src/__tests__'],
  snapshotSerializers: ['jest-serializer-path'],
  collectCoverageFrom: ['./src/**/*.ts'],
  reporters: process.env.CI
    ? [['jest-silent-reporter', { useDots: true }]].concat(
        useCoverage ? ['jest-junit'] : []
      )
    : ['default'].concat(useCoverage ? ['jest-junit'] : []),
  transform: { '\\.[jt]sx?$': 'ts-jest' },
  moduleFileExtensions: ['js', 'ts', 'json']
};
