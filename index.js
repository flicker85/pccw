/**
 * Example problem with existing solution and passing test.
 * See problem 0 in the spec file for the assertion
 * @returns {string}
 */
exports.example = () => "hello world";

function sumFromObjects(arr = []) {
  return arr.reduce((total, obj) => total + obj.val, 0);
}

exports.stripPrivateProperties = (keys = [], source = []) => {
  source.forEach((obj) => {
    keys.forEach((key) => {
      delete obj[key];
    });
  });
  return source;
};

exports.excludeByProperty = (key, source) => {
  return source.filter((obj) => !Object.keys(obj).includes(key));
};

exports.sumDeep = (source = []) => {
  return source.map(({ objects }) => ({ objects: sumFromObjects(objects) }));
};

exports.applyStatusColor = (colors = {}, status = []) => {
  const statusMap = new Map();
  Object.entries(colors).forEach(([color, colorStatus]) => {
    colorStatus.forEach((key) => {
      statusMap.set(key, color);
    });
  });

  return status.reduce((arr, obj) => {
    const color = statusMap.get(obj.status);
    color && arr.push({ ...obj, color });
    return arr;
  }, []);
};

exports.createGreeting = (fn, say) => {
  return (name) => fn(say, name);
};

exports.setDefaults = (defaults) => {
  return (params) => ({ ...defaults, ...params });
};

exports.fetchUserByNameAndUsersCompany = (name, services) => {
  return new Promise((resolve, reject) => {
    const result = {};

    const statusPromise = services.fetchStatus().then((status) => {
      result.status = status;
    });

    const companyPromise = services
      .fetchUsers()
      .then((users) => {
        const user = users.find((user) => user.name === name);
        if (user) {
          result.user = user;
          return user.companyId;
        }
      })
      .then((companyId) => {
        if (companyId !== undefined) {
          return services.fetchCompanyById(companyId);
        }
      })
      .then((company) => {
        company && (result.company = company);
      });

    Promise.all([statusPromise, companyPromise])
      .then(() => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
