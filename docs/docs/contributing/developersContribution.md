## Developers Contribution
If you want to contribute to the project, this is the requirements to do it:

1. [Create an Issue](https://github.com/RafaelGB/obsidian-db-folder/issues) or comment inside an existing Issue on the [roadmap](https://github.com/RafaelGB/obsidian-db-folder/issues) indicating your intention of developing it.
2. Explain your idea or design in the description of the issue.
3. After your idea is accepted, the issue will be assigned to you and you will be able to work on it.
4. When you finish your work, you can generate a pull request to the master branch and will  be reviewed by the team.
5. Once the pull request is accepted, the changelog will be updated for the next release (including the link to your github account as a reference of your work) and merged to the master branch.
6. The issue will be closed once the author of the pull request confirms that the work is done.

## Unitary test
We are using [Jest](https://jestjs.io/) to test our code (not well maintained yet, but working on it).
If you want to contribute with the tests, the structure is under `src/mocks`  & `src/__tests__` folders.

The `__tests__` folder is where the jest tests are located. They are using the `.test.js` extension. The `mocks` folder is where generated data used in the tests are located.